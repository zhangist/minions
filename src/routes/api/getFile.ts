import * as fs from "fs";
import * as path from "path";
import { RequestHandler } from "express";

const handler: RequestHandler = (req, res) => {
  if (!process.env.SERVER_FILES_DIR) {
    res.status(500).send({
      code: 500,
      message: "File path missing",
    });
    return;
  }

  const filename = req.params.filename;
  const filePath = path.resolve(process.env.SERVER_FILES_DIR, filename);

  if (filename && fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({
      code: 404,
      message: "File not found",
    });
  }
};

export default handler;
