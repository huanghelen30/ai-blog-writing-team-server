import express from "express";
import * as researchController from "../controllers/researchController.js";

const researchRoutes = (model) => {
  const router = express.Router();

  router.post("/research", researchController.handleResearch);
  router.get("/:blogId", researchController.getResearch);
  
  return router;
};

export default researchRoutes;
