import express from "express";
import BlogController from '../controllers/blogController.js';

const blogRoutes = () => {
  const router = express.Router();

    router.get('/', BlogController.getAllBlogs);
    router.get('/:blogId', BlogController.getBlogById);
    router.post('/', BlogController.createBlog);
    router.put('/:blogId', BlogController.editBlog);

    return router;
};

export default blogRoutes;
