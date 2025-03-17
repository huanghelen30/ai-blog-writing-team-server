import express from "express";
import * as researchController from "../controllers/researchController.js";

const researchRoutes = () => {
  const router = express.Router();

  router.post("/", researchController.handleResearch);
  router.get("/:blogId", researchController.getResearch);
  
  return router;
};

export default researchRoutes;