import express from "express";
import * as writeController from "../controllers/writeController.js";

const writeRoutes = (model) => {
  const router = express.Router();

  router.post("/:blogId", (req, res) =>
    writeController.writeDraft(req, res, model)
  );

  return router;
};

export default writeRoutes;