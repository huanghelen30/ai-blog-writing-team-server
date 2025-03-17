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
    if (titles.length === 0) throw new Error("No search results found");

    const mainTopic = await fetchTopicSummary(titles[0]);
    const relatedTopics = await Promise.allSettled(
      titles.slice(1, 4).map(title => fetchTopicSummary(title))
    );

    const formattedRelatedTopics = relatedTopics
      .filter(result => result.status === 'fulfilled' && result.value?.summary)
      .map(result => ({
        title: result.value.title,
        description: result.value.description,
        summary: result.value.summary,
        url: result.value.url
      }));

    return {
      mainTopic,
      relatedTopics: formattedRelatedTopics
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
    
    const researchEntries = [
      { 
        blog_id: blogId, 
        source: research.mainTopic.url || research.mainTopic.title || "Unknown", 
        content: JSON.stringify(research.mainTopic) 
      },
      ...research.relatedTopics.map(topic => ({
        blog_id: blogId, 
        source: topic.url || topic.title || "Unknown", 
        content: JSON.stringify(topic)
      }))
    ];

    await Promise.all(researchEntries.map(entry => saveResearchData(blogId, entry)));
    return true;
  } catch (error) {
    console.error('Error saving research:', error);
    throw error;
  }
};

const analyzeResearch = async (question, research, model) => {
  try {
    const prompt = `Generate a response to the question: "${question}" based on the following data: 
    Main Topic: ${research.mainTopic.title} | Summary: ${research.mainTopic.summary} 
    Related Topics: ${research.relatedTopics.map(topic => `${topic.title}: ${topic.summary}`).join(" ")}`;

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
  analyzeResearch,
  getResearchByBlogId
};