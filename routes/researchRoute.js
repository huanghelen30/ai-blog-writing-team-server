import express from "express";
import axios from "axios";
import { saveResearchData, getResearchByBlogId } from '../models/researchModel.js';
import { createBlog, updateBlog, getBlogById } from '../models/blogModel.js';

const researchRoute = (model) => {
  const router = express.Router();

  router.post("/search", async (req, res) => {
    try {
      const { topic } = req.body;
      console.log("Received topic:", topic);

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const headers = {
        'User-Agent': 'AIBlogAgent/1.0 (huanghelen30@gmail.com)',
        'Accept': 'application/json'
      };

      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=5&format=json&origin=*`;
        const searchResponse = await axios.get(searchUrl, { headers });
        
        const titles = searchResponse.data[1] || [];
        const descriptions = searchResponse.data[2] || [];
        const urls = searchResponse.data[3] || [];
        
        if (titles.length === 0) {
          return res.status(404).json({ error: "No search results found" });
        }
        
        try {
          const mainTopicUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[0])}`;
          const mainTopicResponse = await axios.get(mainTopicUrl, { headers });
          
          const mainTopic = {
            title: mainTopicResponse.data.title,
            description: mainTopicResponse.data.description || "",
            extract: formatAsPoints(mainTopicResponse.data.extract || ""),
            url: mainTopicResponse.data.content_urls?.desktop?.page || ""
          };
          
          const relatedPromises = [];
          for (let i = 1; i < Math.min(4, titles.length); i++) {
            relatedPromises.push(
              axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[i])}`, { headers })
                .catch(error => {
                  console.error(`Error fetching related topic ${titles[i]}:`, error.message);
                  return null;
                })
            );
          }
          
          const relatedResponses = await Promise.allSettled(relatedPromises);
          const relatedTopics = relatedResponses
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => {
              const data = result.value.data;
              return {
                title: data.title,
                description: data.description || "",
                summary: formatAsPoints(data.extract || ""),
                url: data.content_urls?.desktop?.page || ""
              };
            });
          
          const research = {
            mainTopic,
            relatedTopics
          };
          
          return res.json({ research });
          
        } catch (detailError) {
          console.error("Error fetching detailed content:", detailError.message);
          
          const mainTopic = {
            title: titles[0],
            description: descriptions[0] || "",
            extract: formatAsPoints(descriptions[0] || ""),
            url: urls[0] || ""
          };
          
          const relatedTopics = [];
          for (let i = 1; i < Math.min(4, titles.length); i++) {
            relatedTopics.push({
              title: titles[i],
              description: descriptions[i] || "",
              summary: formatAsPoints(descriptions[i] || ""),
              url: urls[i] || ""
            });
          }
          
          const research = {
            mainTopic,
            relatedTopics
          };
          
          return res.json({ research });
        }

      } catch (searchError) {
        console.error("Error performing search:", searchError.message);
        return res.status(404).json({ error: "Could not find content for the specified topic" });
      }

    } catch (error) {
      console.error("General error:", error.message);
      console.error(error.stack);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  router.post("/save", async (req, res) => {
    try {
      const { blogId, research } = req.body;

      let blog_id = blogId;

      if (!blogId) {
        const [newBlog] = await createBlog({
          title: research.mainTopic.title || "Untitled Research",
          content: "",
          status: "draft"
        });
        blog_id = newBlog.id;
      }

      await saveResearchData({
        blog_id,
        source: research.mainTopic.url || research.mainTopic.title,
        content: JSON.stringify(research.mainTopic)
      });

      if (research.relatedTopics && research.relatedTopics.length > 0) {
        for (const topic of research.relatedTopics) {
          await saveResearchData({
            blog_id,
            source: topic.url || topic.title,
            content: JSON.stringify(topic)
          });
        }
      }

      res.json({ success: true, blogId: blog_id });
    } catch (error) {
      console.error("Error saving research:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:blogId", async (req, res) => {
    try {
      const { blogId } = req.params;
      const researchData = await getResearchByBlogId(blogid);

      const formattedData = researchData.map(item => ({
        id: item.id,
        source: item,source, 
        content: JSON.parse(item.content),
        created_at: item.created_at
      }));

      res.json({ research: formattedData });
    } catch (error) {
      console.error("ERror fetching research:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/analyze", async (req, res) => {
    try {
      const { blogId, question } = req.body;
      
      const researchData = await getResearchByBlogId(blogId);
      const blog = await getBlogById(blogId);
      
      if (!researchData.length) {
        return res.status(404).json({ error: "No research data found for this blog" });
      }
      
      const formattedResearch = researchData.map(item => {
        const content = JSON.parse(item.content);
        return {
          source: item.source,
          title: content.title || "",
          description: content.description || "",
          extract: Array.isArray(content.extract || content.summary) 
            ? (content.extract || content.summary).join("\n") 
            : content.extract || content.summary || ""
        };
      });
      
      const currentDraft = blog.content || "";
      
      const prompt = `
      You are a helpful research assistant. The user is writing a blog post on the following topic: "${blog.title}".

      They have the following research materials:
      ${formattedResearch.map(r => `
      SOURCE: ${r.source}
      TITLE: ${r.title}
      DESCRIPTION: ${r.description}
      CONTENT: ${r.extract}
      `).join('\n\n')}

      Current draft of their blog post:
      "${currentDraft}"

      Their question is: "${question}"

      Based on the research materials and their current draft, please provide a helpful response.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      res.json({ 
        answer: response,
        researchSources: formattedResearch.map(r => r.source)
      });
      
    } catch (error) {
      console.error("Error analyzing research:", error);
      res.status(500).json({ error: error.message });
    }
  });

  function formatAsPoints(text) {
    if (!text) return [];

    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences.slice(0, 4).map(sentence => `• ${sentence.trim()}`);
  }

  return router;
};

export default researchRoute;