import { getResearchData } from "../models/researchModel.js";
import * as BlogModel from "../models/blogModel.js";

export const writeDraft = async (req, res, model) => {
    try {
      const { action } = req.body;
      const id = req.params.blogId;

      if (!id) {
        return res.status(400).json({ error: "Research data with mainTopicSummary is required" });
      }

      let existingBlog = await BlogModel.getBlogById(id);
      let existingResearch = await getResearchData(id);

      if (!existingBlog) {
        return res.status(404).json({ error: "Blog draft not found" });
      }

      const mainTopic = existingBlog.selectedTopic;
      const research = existingResearch.content;
      const articlePrompt = `Write a detailed first draft article about: "${mainTopic}".

      take in this research data: "${research}" to write a detailed first draft article.

      Your article should:
      - Have a clear, engaging introduction
      - Be well-structured with logical flow between paragraphs
      - Be informative and fact-based
      - Include a concise conclusion
      - Be max 300 words in length
      - Avoid unnecessary fluff and jargon
      - write it out as if it were a essay in paragraph format with no bold or italic characters, skip the headings and subheadings`;

      const result = await model.generateContent(articlePrompt);
      const responseText = result.response.text().trim();
      let cleanResponse = responseText.replace(/(\*\*|\*|##)/g, "");
      cleanResponse = cleanResponse.replace(/\n+/g, "\n").trim()
      
      res.json({
        message: "Draft written successfully",
        content: cleanResponse,
      });

      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
      }
}