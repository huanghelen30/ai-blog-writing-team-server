import express from "express";
import BlogController from '../controllers/blogController.js';
import { getResearchByBlogId, deleteResearchData } from '../models/researchModel.js';

const router = express.Router();

router.get('/blogs', BlogController.getAllBlogs);
router.get('/blogs/:id', BlogController.getBlogById);
router.post('/blogs', BlogController.createBlog);

export default router;