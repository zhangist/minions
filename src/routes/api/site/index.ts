import * as express from "express";
import getHello from "./getHello";

const router = express.Router();

router.get("/hello", getHello);

export default router;
