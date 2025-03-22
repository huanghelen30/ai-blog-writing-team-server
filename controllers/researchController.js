import { getBlogTopicById, getResearchByBlogId, saveResearchData } from "../models/researchModel.js";
import researchService from "../service/researchService.js";

export const handleResearch = async (req, res) => {
  try {
    const { action, userInput } = req.body;
    const blogId = req.params.blogId; 

    console.log(`[handleResearch] Received request for blogId: ${blogId}, action: ${action}, userInput: ${userInput}`);

    if (!blogId) {
      console.warn(`[handleResearch] Invalid or missing blogId`);
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const topic = await getBlogTopicById(blogId);
    console.log(`[handleResearch] Retrieved topic for blogId: ${blogId}`, topic);

    if (!topic || Object.keys(topic).length === 0 || !topic) {
      console.warn(`[handleResearch] No valid topic found for blogId: ${blogId}`);
      return res.status(404).json({ error: "No valid topic found for this blog ID" });
    }

    console.log(`[handleResearch] Selected topic for blogId ${blogId}: ${topic}`);

    let researchData = null;

    if (action === "research") {
      console.log(`[handleResearch] Fetching research data for topic: ${topic}`);
      researchData = await researchService.fetchResearch(topic);
    } else {
      console.log(`[handleResearch] Fetching existing research data for blogId: ${blogId}`);
      researchData = await getResearchByBlogId(blogId);
    }

    console.log(`[handleResearch] researchData after processing action:`, researchData);

    if (!researchData) {
      console.warn(`[handleResearch] No research data found for blogId: ${blogId}`);
      return res.status(404).json({ error: "No research data available" });
    }

    return res.json({
      mainTopicSummary: researchData?.mainTopic?.summary || "",
      researchSource: researchData?.mainTopic?.url ? [researchData.mainTopic.url] : []
    });

  } catch (error) {
    console.error(`[handleResearch] Error processing research for blogId ${req.params.blogId}:`, error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
};

export const saveResearch = async (req, res) => {
  const blogId = req.params.blogId;
  const { mainTopic, source } = req.body;

  try {
    if (!blogId) {
      throw new Error('Blog ID is required to save research');
    }
    
    const researchEntry = 
      { 
        blog_id: blogId,
        content: JSON.stringify(mainTopic),
        source: source || "Unknown",  
      }
    ;

    await saveResearchData(blogId, researchEntry);
    res.json({ message: "Research saved successfully!" });
  } catch (error) {
    console.error('Error saving research:', error);
    throw error;
  }
};


export const getResearch = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    console.log(`[getResearch] Received request for blogId: ${blogId}`);

    if (!blogId) {
      console.warn(`[getResearch] Missing blogId in request`);
      return res.status(400).json({ error: "Blog ID is required" });
    }

    console.log(`[getResearch] Fetching research for blogId: ${blogId}`);
    const researchData = await getResearchByBlogId(blogId);
    console.log(`[getResearch] Research data fetched:`, researchData);

    if (!researchData || Object.keys(researchData).length === 0) {
      console.warn(`[getResearch] No research found for blogId: ${blogId}`);
      return res.status(404).json({ error: "Research not found for this blog ID" });
    }

    console.log(`[getResearch] Returning research data for blogId: ${blogId}`);
    return res.json({ research: researchData });

  } catch (error) {
    console.error(`[getResearch] Error fetching research for blogId ${req.params.blogId}:`, error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Error fetching research", 
        message: error.message 
      });
    }
  }
};
