import express from "express";
import * as researchController from "../controllers/researchController.js";

const researchRoutes = () => {
  const router = express.Router();

  router.post("/:blogId", researchController.handleResearch);
  router.put("/:blogId", researchController.saveResearch);
  router.get("/:blogId", researchController.getResearch);
  
  return router;
};

export default researchRoutes;