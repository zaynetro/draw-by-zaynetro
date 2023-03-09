import { assert, assertEquals, ServerRequestBody } from "./test_deps.ts";
import { router } from "./app.ts";
import { Request, Status, testing } from "./deps.ts";

Deno.test({
  name: "Draw default",
  async fn() {
    const ctx = testing.createMockContext({
      path: "/api/draw",
    });
    const next = testing.createMockNext();

    await router.routes()(ctx, next);

    assertEquals(ctx.response.status, Status.OK);
    assert(
      (ctx.response.body as string).startsWith("<svg"),
      `Body=${ctx.response.body as string}`,
    );
    assertEquals(ctx.response.headers.get("Content-Type"), "image/svg+xml");
  },
  // We don't clear a delay timeout hence we disable the checks.
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Draw API",
  async fn(t) {
    await t.step("Render simple", async () => {
      const body = "export default [[2]];";
      const ctx = makePostCtx(body);
      const next = testing.createMockNext();

      await router.routes()(ctx, next);

      assertEquals(
        ctx.response.body,
        `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><g><rect x="0" y="0" width="20" height="20" fill="red"></rect></g></svg>`,
      );
      assertEquals(ctx.response.status, Status.OK);
      assertEquals(ctx.response.headers.get("Content-Type"), "image/svg+xml");
    });

    await t.step("Render syntax error", async () => {
      const body = "let a = 2.smth;";
      const ctx = makePostCtx(body);
      const next = testing.createMockNext();

      await router.routes()(ctx, next);

      assertEquals(ctx.response.status, Status.InternalServerError);
      assertEquals(ctx.response.body, "Error...");
    });

    await t.step("Render with imports", async () => {
      const body = `
import { Drawing, Color } from '../static/painter.ts';
const d = new Drawing();
export default d.complete();
`;
      const ctx = makePostCtx(body);
      const next = testing.createMockNext();

      await router.routes()(ctx, next);

      assertEquals(ctx.response.status, Status.OK);
      assert(
        (ctx.response.body as string).startsWith("<svg"),
        `Body=${ctx.response.body as string}`,
      );
    });
  },
  // We don't clear a delay timeout hence we disable the checks.
  sanitizeResources: false,
  sanitizeOps: false,
});

function makePostCtx(body: string) {
  const ctx = testing.createMockContext();

  const request = new Request({
    remoteAddr: undefined,
    headers: new Headers({
      "content-type": "text/plain",
      "content-length": String(body.length),
      "host": "localhost",
    }),
    method: "POST",
    url: "/api/draw",
    // deno-lint-ignore no-explicit-any
    error(_reason?: any) {},
    getBody(): ServerRequestBody {
      return {
        body: null,
        readBody: () => Promise.resolve(new TextEncoder().encode(body)),
      };
    },
    respond: (_response: Response) => Promise.resolve(),
  });
  ctx.request = request;
  return ctx;
}
