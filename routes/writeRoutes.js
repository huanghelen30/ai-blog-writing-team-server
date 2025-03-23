import express from "express";
import * as writeController from "../controllers/writeController.js";

const writeRoutes = (model) => {
  const router = express.Router();

  router.post("/draft/:blogId", (req, res) =>
    writeController.writeDraft(req, res, model)
  );

  router.post("/refine/:blogId", (req, res) =>
    writeController.refineDraft(req, res, model)
  );

  return router;
};

export default writeRoutes;