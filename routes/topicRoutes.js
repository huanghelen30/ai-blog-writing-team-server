import express from "express";
import { createBlog } from "../models/blogModel.js";

const topicRoutes = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      let { userInput, existingTopic, selectedTopic, hasExistingTopic } = req.body;

      if (selectedTopic) {
        try {
          const newBlog = await createBlog({
            title: selectedTopic,
            selectedTopic: selectedTopic,
            status: "draft"
          });
          return res.json({
            message: "Topic selected! Let's pass it off to Oliver to start research.",
            selectedTopic,
            newBlog,
            nextStep: "/research"
          });
        } catch (error) {
          console.error("Error creating blog:", error);
          return res.status(500).json({ error: "Failed to create blog" });
        }
      }

      if (hasExistingTopic === undefined) {
        return res.json({
          message: "Do you already have a topic in mind?",
          options: ["Yes, I have a topic", "No, I need suggestions"],
          nextStep: "/topics"
        });
      }

      if (hasExistingTopic === true && existingTopic) {
        try {
          const newBlog = await createBlog({
            title: existingTopic,
            selectedTopic: existingTopic,
            content: "",
            status: "draft",
          });
          return res.json({
            message: "Topic selected! Let's pass it off to Oliver to start research",
            selectedTopic: existingTopic,
            newBlog,
            nextStep: "/research"
          });
        } catch (error) {
          console.error("Error creating blog:", error);
          return res.status(500).json({ error: "Failed to create blog" });
        }
      }

      if (hasExistingTopic === false && userInput) {
        try {
          const prompt = 
            `Generate a list of 5 distinct and actionable topic 
            ideas for a blog based on the following keywords: ${userInput}. 
            Please format the topics in a concise, clear,
            list with no explanations or reasoning included.`;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim();

          const topics = responseText
            .split("\n")
            .map((topic) => topic.replace(/^-?\s*/, "").trim())
            .filter(Boolean);

          return res.json({
            topics,
            message: "Select a topic to move on to research with Oliver.",
            nextStep: "/research"
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Failed to generate topics" });
        }
      }

      return res.status(400).json({ error: "User input or existing topic is required" });

    } catch (error) {
      console.error("General error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default topicRoutes;
