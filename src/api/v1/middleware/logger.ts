import { Request, RequestHandler, Response } from "express";
import fs, { WriteStream } from "fs";
import morgan, { StreamOptions } from "morgan";
import path from "path";

const logsDir: string = path.join(process.cwd(), "src", "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream: WriteStream = fs.createWriteStream(
    path.join(logsDir, "access.log"),
    { flags: "a" }
);

const errorLogStream: StreamOptions = {
    write: (message: string): void => {
        fs.appendFileSync(path.join(logsDir, "error.log"), message);
    },
};

/**
 * Logs all incoming requests using the combined format.
 */
const accessLogger: RequestHandler = morgan("combined", {
    stream: accessLogStream,
});

/**
 * Logs only failed requests using the combined format.
 */
const errorLogger: RequestHandler = morgan("combined", {
    stream: errorLogStream,
    skip: (_req: Request, res: Response): boolean => res.statusCode < 400,
});

/**
 * Provides development-friendly console logging.
 */
const consoleLogger: RequestHandler = morgan("dev");

export { accessLogger, errorLogger, consoleLogger };

