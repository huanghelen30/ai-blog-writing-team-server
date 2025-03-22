import * as BlogModel from "../models/blogModel.js";

export const writeDraft = async (req, res, model) => {
    try {
      const { action } = req.body;
      const id = req.params.blogId;

      if (!id) {
        return res.status(400).json({ error: "Research data with mainTopicSummary is required" });
      }

      let existingBlog = await BlogModel.getBlogById(id);

      if (!existingBlog) {
        return res.status(404).json({ error: "Blog draft not found" });
      }

      const mainTopic = existingBlog.selectedTopic;
      const articlePrompt = `Write a detailed first draft article about: "${mainTopic}".

      Your article should:
      - Have a clear, engaging introduction
      - Be well-structured with logical flow between paragraphs
      - Be informative and fact-based
      - Include a concise conclusion
      - Be approximately 500-800 words in length
      - Avoid unnecessary fluff and jargon

      Format the article with appropriate headers and paragraph breaks for readability.`;

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

export const refineDraft = async (req, res) => {
    try {
      const { action, userInput, blogContent } = req.body;
      const id = req.params.blogId;

      if (!blogContent) {
        return res.status(400).json({ error: "existing blog content is required" });
      }

      let existingBlog = await BlogModel.getBlogById(id);

      if (!existingBlog) {
        return res.status(404).json({ error: "Blog draft not found" });
      }

      const articlePrompt = `Based on userinput and the existing blog content, refine the draft article.`;

      const result = await model.generateContent(articlePrompt);
      const responseText = result.response.text().trim();

      let cleanResponse = responseText.replace(/(\*\*|\*|##)/g, "");
      cleanResponse = cleanResponse.replace(/\n+/g, "\n").trim()
      
      res.json({
        message: "Draft suggestions made successfully",
        content: cleanResponse,
      });

      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
      }
}