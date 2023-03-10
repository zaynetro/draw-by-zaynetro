import { Application, etag, FlashServer, Router, Status } from "./deps.ts";
import { Color, SIZE } from "./static/painter.ts";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
  deno: {
    // Not specifying the deno.permissions option or one of its children will cause the worker to inherit by default.
    permissions: {
      // https://deno.land/manual@v1.31.1/basics/permissions#permissions-list
      env: false,
      sys: false,
      hrtime: false,
      net: [
        "draw-zaynetro.fly.dev",
      ],
      ffi: false,
      read: [
        "./user-code/",
        "./static/",
      ],
      run: false,
      write: false,
    },
  },
});

export const router = new Router();
router
  .get("/", async (ctx) => {
    await ctx.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  })
  .get("/api/draw", async (ctx) => {
    const payload = await Deno.readTextFile("./static/draw-deno.ts");
    const svg = await draw(payload);
    ctx.response.body = svg;
    ctx.response.headers.set("Content-Type", "image/svg+xml");
  })
  .post("/api/draw", async (ctx) => {
    const body = ctx.request.body();
    let userCode = "";
    if (body.type === "form-data") {
      const reader = body.value;
      const dataBody = await reader.read({ maxSize: 20000 });
      const files = dataBody.files;
      if (!files) {
        ctx.response.body = "No files uploaded.";
        ctx.response.status = Status.BadRequest;
        return;
      }

      userCode = new TextDecoder().decode(files[0].content);
    } else {
      const text = ctx.request.body({ type: "text" });
      userCode = await text.value;
    }

    try {
      const svg = await draw(userCode);
      ctx.response.body = svg;
      ctx.response.headers.set("Content-Type", "image/svg+xml");
    } catch (e) {
      console.error("Failed to draw", e);
      ctx.response.body = "Error...";
      ctx.response.status = Status.InternalServerError;
    }
  })
  .get("/static/(.*)", async (ctx) => {
    await ctx.send({
      root: Deno.cwd(),
      contentTypes: {
        ".ts": "text/plain",
      },
    });
  })
  .get("(.*)", (ctx) => {
    ctx.response.status = Status.NotFound;
    ctx.response.body = "Not Found.";
  });

async function draw(payload: string): Promise<string> {
  const id = Math.floor(Math.random() * 1000000);
  const fileName = `./user-code/${id}.ts`;
  console.log("Creating new file", fileName);

  try {
    await Deno.mkdir("./user-code", { recursive: true });
    await Deno.writeTextFile(fileName, payload);

    const canvas = await Promise.race([
      waitMessage(fileName),
      timeout(250),
    ]) as number[][];

    // Build SVG
    const displaySize = 400;
    const pixelSize = displaySize / SIZE;
    const viewBox = `0 0 ${displaySize} ${displaySize}`;
    const rects = canvas.map((column, cx) => (
      column.map((color, cy) => {
        if (color == Color.White) {
          return null;
        }

        const x = cx * pixelSize;
        const y = cy * pixelSize;
        const w = pixelSize;
        const h = pixelSize;
        const fill = getFill(color);
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"></rect>`;
      })
    ))
      .flat()
      .filter((r) => !!r)
      .join("");

    const svg =
      `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg"><g>${rects}</g></svg>`;

    return svg;
  } finally {
    // Clean up temporary file
    try {
      console.log("Cleaning file", fileName);
      await Deno.remove(fileName);
    } catch (_e) {
      // It's OK
    }
  }
}

export const app = new Application({
  // Doesn't work with --watch: https://github.com/denoland/deno/issues/16699
  // serverConstructor: FlashServer,
});
app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
});
app.use(etag.factory());
app.use(router.routes());
app.use(router.allowedMethods());

function waitMessage(fileName: string): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    function onMessage(m: MessageEvent) {
      const data = m.data;
      if (typeof data != "object") {
        return;
      }

      if (data.fileName != fileName) {
        // Ignore events from other requests
        return;
      }

      if (Array.isArray(data.result)) {
        clear();
        resolve(data.result as number[][]);
      } else {
        clear();
        reject("Invalid return value: " + typeof data.result);
      }
    }

    function onError(e: ErrorEvent) {
      clear();
      reject(new Error(e.message));
    }

    function clear() {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
    }

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);

    worker.postMessage(fileName);
  });
}

function timeout(ms: number): Promise<void> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
}

function getFill(color: Color) {
  switch (color) {
    case Color.Black:
      return "#000";
    case Color.Red:
      return "red";
    case Color.Green:
      return "green";
    case Color.Blue:
      return "blue";
    default:
      return "#fff";
  }
}
