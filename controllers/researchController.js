import { getResearchByBlogId } from "../models/researchModel.js";
import researchService from "../service/researchService.js";

export const handleResearch = async (req, res) => {
  try {
    const { blogId, topic, question, skipResearchFetch } = req.body;
    
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    
    if (skipResearchFetch) {
      return res.json({ 
        answer: "You opted to skip the research step.", 
        researchSources: [],
        nextStep: "/write",
      });
    }

    if (!topic) {
      return res.status(400).json({ error: "Topic is required for analysis" });
    }

    const research = await researchService.fetchResearch(topic);
    await researchService.saveResearch(blogId, research);
    
    let answer = "No question provided.";
    if (question) {
      try {
        answer = await researchService.analyzeResearch(
          question, 
          research, 
          req.app.locals.model
        );
      } catch (analyzeError) {
        console.error("Error in research analysis:", analyzeError);
        answer = "Error analyzing research. Please try again.";
      }
    }
    console.log("Research Object: ", research);

    const researchSources = [];
    if (research.mainTopic && research.mainTopic.url) {
      researchSources.push(research.mainTopic.url);
    }
    
    if (research.relatedTopics && Array.isArray(research.relatedTopics)) {
      research.relatedTopics.forEach(topic => {
        if (topic.url) {
          researchSources.push(topic.url);
        }
      });
    }

    return res.json({
      answer,
      researchSummaries: {
        mainTopicSummary: research.mainTopic ? research.mainTopic.summary : [],
        relatedTopicSummaries: research.relatedTopics ? research.relatedTopics.map(topic => topic.summary) : []
      },
      researchSources,  
      nextStep: "/write",
    });
    
  } catch (error) {
    console.error("Error in handleResearch:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
};

export const getResearch = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    if (!blogId) {
      return res.status(400).json({ error: 'Blog ID is required' });
    }
    
    console.log('Fetching research for blogId:', blogId);
    
    const researchData = await getResearchByBlogId(blogId);
    console.log('Research data fetched:', researchData ? researchData.length : 0, 'items');

    if (!researchData || researchData.length === 0) {
      return res.status(404).json({ error: 'Research not found for this blogId' });
    }

    return res.json({ research: researchData });
  } catch (error) {
    console.error("Error fetching research:", error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Error fetching research", 
        message: error.message 
      });
    }
  }
};