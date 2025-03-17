import express from "express";
import * as BlogModel from "../models/blogModel.js";

const writeRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { research } = req.body;
      console.log("Received research data:", JSON.stringify(research, null, 2));

      if (!research || !research.mainTopicSummary) {
        return res.status(400).json({ error: "Research data with mainTopicSummary is required" });
      }

      const { id } = req.params;

      let existingBlog = await BlogModel.getBlogById(id);

      if (!existingBlog) {
        return res.status(404).json({ error: "Blog draft not found" });
      }

      const mainTopic = research.mainTopicSummary;
      const relatedTopics = research.relatedTopicSummaries ? research.relatedTopicSummaries.join(", ") : "";
      const sources = research.sources ? research.sources.join(", ") : "No sources provided";

      const articlePrompt = `Write a detailed article about: "${mainTopic}".

      Additional information:
      - Related topics: ${relatedTopics}
      - Use insights from these sources: ${sources}

      Your article should:
      - Have a clear, engaging introduction
      - Be well-structured with logical flow between paragraphs
      - Be informative and fact-based
      - Include a concise conclusion
      - Be approximately 500-800 words in length
      - Avoid unnecessary fluff and jargon

      Format the article with appropriate headers and paragraph breaks for readability.`;

      console.log("Constructed article prompt");

      const result = await model.generateContent(articlePrompt);

      let articleContent = "No content returned";

      if (result && result.response) {
        if (
          result.response.candidates &&
          result.response.candidates.length > 0 &&
          result.response.candidates[0].content &&
          result.response.candidates[0].content.parts &&
          result.response.candidates[0].content.parts.length > 0 &&
          result.response.candidates[0].content.parts[0].text
        ) {
          articleContent = result.response.candidates[0].content.parts[0].text.trim();
          console.log("Successfully extracted article from Gemini response");
        } else if (result.response.text) {
          articleContent = result.response.text.trim();
        }
      }

      const updatedBlog = await BlogModel.editBlog(id, {content: articleContent });
      
      res.json({
        message: "Draft updated successfully",
        content: updatedBlog.content,
      });

      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    });

    return router;
};

export default writeRoute;