import pino from "pino";
import pretty from "pino-pretty";

export const loggerOptions = pretty({
  colorize: true,
  translateTime: "SYS:standard",
});

export default pino(loggerOptions);
