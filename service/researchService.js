import axios from "axios";
import { saveResearchData, getResearchByBlogId } from "../models/researchModel.js";

const headers = {
  "User-Agent": "AIBlogAgent/1.0 (huanghelen30@gmail.com)",
  "Content-Type": "application/json"
};

const fetchResearch = async (topic) => {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=5&format=json&origin=*`;
    const searchResponse = await axios.get(searchUrl, { headers });

    const titles = searchResponse.data[1] || [];

    if (titles.length === 0) {
      console.error(`No search results found for topic: ${topic}`);
      return {
        mainTopic: {
          title: "No results found",
          description: "Sorry, no relevant research could be found for this topic.",
          summary: "Please try searching with a different topic or phrase.",
          url: ""
        }
      };
    }

    const mainTopic = await fetchTopicSummary(titles[0]);

    return {
      mainTopic
    };
  } catch (error) {
    console.error(`Error fetching research for topic ${topic}:`, error);
    throw error;
  }
};

const fetchTopicSummary = async (title) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const { data } = await axios.get(url, { headers });

    return {
      title: data.title,
      description: data.description || "",
      summary: data.extract || "",
      url: data.content_urls?.desktop?.page || ""
    };
  } catch (error) {
    console.error(`Error fetching topic ${title}:`, error.message);
    return { title, description: "", summary: "", url: "" };
  }
};

const saveResearch = async (blogId, research) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required to save research');
    }

    const researchEntry = [
      { 
        blog_id: blogId, 
        source: research.mainTopic.url || "Unknown", 
        content: JSON.stringify(research.mainTopic) 
      }
    ];

    await saveResearchData(blogId, researchEntry);
    return true;
  } catch (error) {
    console.error('Error saving research:', error);
    throw error;
  }
};

const analyzeResearch = async (question, research, model) => {
  try {
    const prompt = `Generate a response to the question: "${question}" based on the following data: 
    Summary: ${research.content}`

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing research:', error);
    throw error;
  }
};

export default {
  fetchResearch,
  fetchTopicSummary,
  saveResearch,
  analyzeResearch
};
