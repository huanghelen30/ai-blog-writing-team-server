import { getBlogTopicById, getResearchByBlogId } from "../models/blogModel.js";
import { saveResearchData } from "../models/researchModel.js";
import researchService from "../service/researchService.js";

export const handleResearch = async (req, res) => {
  try {
    const { action } = req.body;
    const id = req.params.blogId; 

    if (!id) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const topic = await getBlogTopicById(id);

    if (!topic || Object.keys(topic).length === 0 || !topic) {
      return res.status(404).json({ error: "No valid topic found for this blog ID" });
    }

    const topicString = topic.selectedTopic;
    let researchData = null;

    if (action === "research") {
      researchData = await researchService.fetchResearch(topicString);
    } else {
      researchData = await getResearchByBlogId(id);
    }

    if (!researchData) {
      return res.status(404).json({ error: "No research data available" });
    }

    return res.json({
      mainTopicSummary: researchData?.mainTopic?.summary || "",
      researchSource: researchData?.mainTopic?.url ? [researchData.mainTopic.url] : []
    });

  } catch (error) {
    console.error(`[handleResearch] Error processing research for blogId ${req.params.id}:`, error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
};

export const saveResearch = async (req, res) => {
  const id = req.params.blogId;
  const { content, source } = req.body;

  try {
    if (!id) {
      throw new Error('Blog ID is required to save research');
    }

    if (!content) {
      throw new Error('Research data is missing or undefined');
    }

    const researchEntry = {
      content: JSON.stringify(content),
      source: source || "Unknown",
    };

    const result = await saveResearchData(id, researchEntry);

    res.json({ message: "Research saved successfully!" });
  } catch (error) {
    console.error('[saveResearch] Error:', error);
    res.status(500).json({ error: "Error saving research", message: error.message });
  }
};



export const getResearch = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    const researchData = await getResearchByBlogId(blogId);
    
    if (!researchData || Object.keys(researchData).length === 0) {
      return res.status(404).json({ error: "Research not found for this blog ID" });
    }

    researchData.content = researchData.content ? JSON.parse(researchData.content) : null;

    return res.json({ research: researchData });

  } catch (error) {
    console.error(`[getResearch] Error fetching research for blogId ${blogId}:`, error);
    res.status(500).json({ error: "Error fetching research", message: error.message });
  }
};
