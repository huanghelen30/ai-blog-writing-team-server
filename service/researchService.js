import express from "express";
import axios from "axios";
import { saveResearchData, getResearchByBlogId } from "../models/researchModel.js";

const headers = {
  "User-Agent": "AIBlogAgent/1.0 (huanghelen30@gmail.com)",
  "Accept": "application/json"
};

const researchRoutes = (model) => {
  const router = express.Router();

  const fetchResearch = async (topic) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=5&format=json&origin=*`;
    const searchResponse = await axios.get(searchUrl, { headers });

    const titles = searchResponse.data[1] || [];
    if (titles.length === 0) throw new Error("No search results found");

    const mainTopic = await fetchTopicSummary(titles[0]);
    const relatedTopics = await Promise.allSettled(
      titles.slice(1, 4).map(title => fetchTopicSummary(title))
    );

    return {
      mainTopic,
      relatedTopics: relatedTopics
        .filter(result => result.status === "fulfilled")
        .map(result => result.value),
    };
  };

const fetchTopicSummary = async (title) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const { data } = await axios.get(url, { headers });

    return {
      title: data.title,
      description: data.description || "",
      summary: formatAsPoints(data.extract || ""),
      url: data.content_urls?.desktop?.page || ""
    };
  } catch (error) {
    console.error(`Error fetching topic ${title}:`, error.message);
    return { title, description: "", summary: "", url: "" };
  }
};

const formatAsPoints = (text) => text.split(/(?<=[.!?])\s+/).slice(0, 4).map(sentence => `• ${sentence.trim()}`);

const saveResearch = async (blogId, research) => {
  const researchEntries = [
    { blog_id: blogId, source: research.mainTopic.url || research.mainTopic.title, content: JSON.stringify(research.mainTopic) },
    ...research.relatedTopics.map(topic => ({
      blog_id: blogId, source: topic.url || topic.title, content: JSON.stringify(topic)
    }))
  ];

  await Promise.all(researchEntries.map(entry => saveResearchData(entry)));
};

const analyzeResearch = async (question, research) => {
  const prompt = `Generate a response to the question: "${question}" based on the following data: 
  Main Topic: ${research.mainTopic.title} | Summary: ${research.mainTopic.summary.join(" ")} 
  Related Topics: ${research.relatedTopics.map(topic => `${topic.title}: ${topic.summary.join(" ")}`).join(" ")}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

router.post("/", async (req, res) => {
  try {
    const { blogId, topic, question } = req.body;

    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const research = await fetchResearch(topic);
    await saveResearch(blogId, research);

    if (question) {
      const analysis = await analyzeResearch(question, research);
      return res.json({ research, analysis });
    }

    res.json({ research });
  } catch (error) {
    console.error("Research error:", error);
    res.status(500).json({ error: "Failed to fetch research" });
  }
});

return router;
};

export default researchRoutes;