import express from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from '../models/blogModel.js';
import { getResearchByBlogId, deleteResearchData } from '../models/researchModel.js';

const blogRoute = () => {
  const router = express.Router();
  
  router.get("/", async (req, res) => {
    try {
      const blogs = await getAllBlogs();
      res.json({ blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await getBlogById(id);
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      const researchData = await getResearchByBlogId(id);
      
      res.json({ 
        blog,
        research: researchData.map(item => ({
          id: item.id,
          source: item.source,
          content: JSON.parse(item.content),
          created_at: item.created_at
        }))
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post("/", async (req, res) => {
    try {
      const { title, content, status = "draft" } = req.body;
      const [blog] = await createBlog({ title, content, status });
      res.status(201).json({ blog });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, status } = req.body;
      
      const updatedData = {};
      if (title !== undefined) updatedData.title = title;
      if (content !== undefined) updatedData.content = content;
      if (status !== undefined) updatedData.status = status;
      
      updatedData.updated_at = new Date();
      
      const [blog] = await updateBlog(id, updatedData);
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json({ blog });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      await deleteResearchData(id);
      
      const deleted = await deleteBlog(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};

export default blogRoute;