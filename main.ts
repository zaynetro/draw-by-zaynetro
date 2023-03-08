import { app } from "./app.ts";

app.addEventListener(
  "listen",
  ({ hostname, port }) => console.log(`Listening on ${hostname}:${port}`),
);

const port = readPort();
await app.listen({ port });

function readPort(): number {
  const port = Deno.env.get('PORT');
  if (port) {
    return parseInt(port, 10);
  }

  return 8000;
}
