const Log = {
  info: (msg) => Log.log("info", msg),
  error: (msg) => Log.log("error", msg),
  log: (type, msg) => console.log(`[${type}]: ${typeof msg == "object" ? JSON.stringify(msg) : msg}`),
}

export { Log };
