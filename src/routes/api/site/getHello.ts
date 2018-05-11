import { RequestHandler } from "express";

const handler: RequestHandler = (req, res) => {
  res.send({
    code: 0,
    message: "Hello world!",
  });
};

export default handler;
