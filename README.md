# A sample Deno project to showcase sandbox

This is an HTTP server that renders SVG files by executing TypeScript code.

## How to use?

You can see default drawing by visiting: https://draw-zaynetro.fly.dev/api/draw
([Source](https://github.com/zaynetro/draw-by-zaynetro/blob/main/static/draw-deno.ts))

```
curl -XPOST -d 'export default [[2, 2]];' https://draw-zaynetro.fly.dev/api/draw > drawing.svg

# Or upload a local file "sample.ts"

curl -XPOST -F "file=@sample.ts" https://draw-zaynetro.fly.dev/api/draw > drawing.svg
```

Here is a sample file you can use:

```ts
// sample.ts
import {
  Color,
  Drawing,
} from "https://draw-zaynetro.fly.dev/static/painter.ts";

const d = new Drawing();
d.border(Color.Blue);
d.setPixel(3, 3, Color.Red);
d.setPixel(3, 4, Color.Red);
d.setPixel(3, 5, Color.Red);
d.setPixel(3, 7, Color.Red);

export default d.complete();
```

## Locally

Start a server:

```
deno task dev
```

Submit your code and save resulting SVG to a file:

```
curl -XPOST -d 'export default [[2, 2]];' http://localhost:8000/api/draw > drawing.svg

# Or upload a local file "sample.ts"

curl -XPOST -F "file=@sample.ts" http://localhost:8000/api/draw > drawing.svg
```
