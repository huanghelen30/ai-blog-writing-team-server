import * as BlogModel from '../models/blogModel.js';

class BlogController {
  static async getAllBlogs(req, res) {
    try {
      const blogs = await BlogModel.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving blogs" });
    }
  };

  static async getBlogById(req, res) {
    try {
      const blog = await BlogModel.getBlogById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving blog" });
    }
  };

  static async createBlog(req, res) {
    try {
      const newBlog = await BlogModel.createBlog(req.body);
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ message: "Error creating blog" });
    }
  };

  static async editBlog(req, res) {
    try {
      const updatedBlog = await BlogModel.updateBlog(req.params.id, req.body);
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: "Error updating blog" });
    }
  };
}

export default BlogController;
