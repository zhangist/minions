import * as fs from "fs";
import * as path from "path";
import { RequestHandler } from "express";

const handler: RequestHandler = (req, res) => {
  if (!process.env.SERVER_FILES_DIR) {
    console.log("process.env.FILES_DIR is empty.");
    res.send({
      code: 500,
      message: "Save file failed.",
    });
    return;
  }

  let saveFileError;
  try {
    fs.renameSync(
      req.file.path || req.file.buffer,
      path.resolve(process.env.SERVER_FILES_DIR, req.file.originalname),
    );
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
};

export default handler;
