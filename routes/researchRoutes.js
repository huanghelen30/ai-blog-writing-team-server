import express from "express";
import * as researchController from "../controllers/researchController.js";

const researchRoutes = (model) => {
  const router = express.Router();

  router.post("/:blogId", (req, res) => 
    researchController.handleResearch(req, res, model));
  router.post("/save/:blogId", researchController.saveResearch);
  router.get("/:blogId", researchController.getResearch);
  
  return router;
};

export default researchRoutes;