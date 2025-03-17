import researchService from "../service/researchService.js";

export const handleResearch = async (req, res) => {
  try {
    const { blogId, topic, question, skipResearchFetch } = req.body;
    
    if (skipResearchFetch) {
      return res.json({ answer: "You opted to skip the research step.", researchSources: [], nextStep: "/write" });
    }

    if (!topic) {
      return res.status(400).json({ error: "Topic is required for analysis" });
    }

    const research = await researchService.fetchAndSaveResearch(blogId, topic);
    
    const answer = await researchService.analyzeResearch(question, research);

    return res.json({
      answer,
      researchSources: research.sources,
      nextStep: "/write",
    });
    
  } catch (error) {
    console.error("Error in handleResearch:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getResearch = async (req, res) => {
  try {
    const { blogId } = req.params;
    const researchData = await researchService.getResearchByBlogId(blogId);
    res.json({ research: researchData });
  } catch (error) {
    console.error("Error fetching research:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
