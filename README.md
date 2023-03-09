# A sample Deno project to showcase sandbox

This is an HTTP server that renders SVG files by executing TypeScript code. 


## How to use?

TODO: curl request
TODO: default drawing and code


## Locally

Start a server:

```
deno task dev
```

Submit your code and save resulting SVG to a file:

```
curl -XPOST -d 'export default [[2, 2]];' http://localhost:8000/api/draw > drawing.svg

# Or upload a local file "draw-deno.ts"

curl -XPOST -F "file=@draw-deno.ts" http://localhost:8000/api/draw > drawing.svg
```

