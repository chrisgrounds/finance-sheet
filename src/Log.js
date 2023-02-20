const Log = {
  info: (msg) => console.log(`[info]: ${typeof msg == "object" ? JSON.stringify(msg) : msg}`),
  error: (msg) => console.log(`[error]: ${typeof msg == "object" ? JSON.stringify(msg) : msg}`),
}

export { Log };
