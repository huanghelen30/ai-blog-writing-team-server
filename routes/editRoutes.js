import express from "express";
import * as editController from "../controllers/editController.js";

const editRoutes = (model) => {
  const router = express.Router();

  router.post("/:blogId", (req, res) =>
    editController.editDraft(req, res, model)
  );

  return router;
};

export default editRoutes;