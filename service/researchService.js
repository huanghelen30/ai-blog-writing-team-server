import axios from "axios";

const headers = {
  "User-Agent": "AIBlogAgent/1.0 (huanghelen30@gmail.com)",
  "Content-Type": "application/json"
};

const fetchResearch = async (topic) => {
  try {
    console.log(`Searching Wikipedia for topic: ${topic}`);
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

    console.log(`Main topic data:`, mainTopic); // Log the final main topic data
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
    
    console.log(`Fetched topic summary for ${title}:`, data); // Log the data response

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

export default {
  fetchResearch,
  fetchTopicSummary
};
