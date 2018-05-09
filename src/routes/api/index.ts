import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import siteRouter from "./site";

const router = express.Router();

router.use(siteRouter);
router.get("/files", async (req, res) => {
    if (process.env.FILES_DIR) {
        let files;
        let readFilesError;
        try {
            files = fs.readdirSync(process.env.FILES_DIR);
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
});
router.post("/upload", (req, res) => {
    if (!process.env.FILES_DIR) {
        console.log("process.env.FILES_DIR is empty.");
        res.send({
            code: 500,
            message: "Save file failed.",
        });
        return;
    }
    let saveFileError;
    try {
        fs.renameSync(req.file.path || req.file.buffer, path.resolve(process.env.FILES_DIR, req.file.originalname));
    } catch (e) {
        saveFileError = e;
    }
    if (saveFileError) {
        console.log(saveFileError);
        res.send({
            code: 500,
            message: "Save file failed.",
        });
        return;
    }
    res.send({
        code: 0,
        message: "Upload file success.",
    });
});

export default router;
