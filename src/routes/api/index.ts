import * as express from "express";
import getFile from "./getFile";
import getFiles from "./getFiles";
import postUpload from "./postUpload";
import siteRouter from "./site";

const router = express.Router();

router.use(siteRouter);
router.get("/file/:filename", getFile);
router.get("/files", getFiles);
router.post("/upload", postUpload);

export default router;
