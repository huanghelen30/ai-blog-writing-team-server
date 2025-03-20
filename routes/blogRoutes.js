import express from "express";
import BlogController from '../controllers/blogController.js';

const blogRoutes = () => {
  const router = express.Router();

    router.get('/', BlogController.getAllBlogs);
    router.get('/:id', BlogController.getBlogById);
    router.post('/', BlogController.createBlog);
    router.put('/:id', BlogController.editBlog);

    return router;
};

export default blogRoutes;
