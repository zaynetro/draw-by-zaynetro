console.log("[worker] Starting...");
addEventListener("message", async (event) => {
  try {
    const e = event as MessageEvent;
    const fileName: string = e.data;
    console.log("[worker] Received a message", fileName);
    const res = await import(fileName);
    postMessage({
      fileName,
      result: res.default,
    });
  } catch (e) {
    console.error("[worker] Execution error", e);
  }
});
