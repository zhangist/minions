import * as fs from "fs";
import { RequestHandler } from "express";

const handler: RequestHandler = (req, res) => {
    if (process.env.SERVER_FILES_DIR) {
        let files;
        let readFilesError;
        try {
            files = fs.readdirSync(process.env.SERVER_FILES_DIR);
        } catch (e) {
            readFilesError = e;
        }
        if (readFilesError) {
            console.log(readFilesError);
            res.send({
                code: 500,
                message: "Read files failed.",
            });
        } else {
            res.send({
                code: 200,
                message: "Read files success.",
                data: files,
            });
        }
    } else {
        res.send({
            code: 500,
            message: "Read files failed.",
        });
    }
};

export default handler;
