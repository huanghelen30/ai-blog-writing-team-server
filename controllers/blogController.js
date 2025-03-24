import * as BlogModel from '../models/blogModel.js';

class BlogController {
  static async getAllBlogs(_req, res) {
    try {
      const blogs = await BlogModel.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Error retrieving blogs:", error);
      res.status(500).json({ message: "Error retrieving blogs" });
    }
  };
  
  static async getBlogById(req, res) {
    try {
      const blog = await BlogModel.getBlogById(req.params.blogId);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving blog" });
    }
  };

  static async createBlog(req, res) {
    try {
      const { selectedTopic } = req.body;
  
      const blogData = {
        selectedTopic,
        content: req.body.content || "No content provided.",
      };
  
      const newBlog = await BlogModel.createBlog(blogData);
      res.status(201).json(newBlog);
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async editBlog(req, res) {
    try {
  
      const updatedBlog = await BlogModel.updateBlog(req.params.blogId, req.body);
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Error updating blog" });
    }
  }
}  

export default BlogController;
