import express from "express";
import axios from "axios";

const researchRoute = () => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { topic } = req.body;
      console.log("Received topic:", topic);

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const headers = {
        'User-Agent': 'AIBlogAgent/1.0 (huanghelen30@gmail.com)',
        'Accept': 'application/json'
      };

      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=5&format=json&origin=*`;
        const searchResponse = await axios.get(searchUrl, { headers });
        
        const titles = searchResponse.data[1] || [];
        const descriptions = searchResponse.data[2] || [];
        const urls = searchResponse.data[3] || [];
        
        if (titles.length === 0) {
          return res.status(404).json({ error: "No search results found" });
        }
        
        try {
          const mainTopicUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[0])}`;
          const mainTopicResponse = await axios.get(mainTopicUrl, { headers });
          
          const mainTopic = {
            title: mainTopicResponse.data.title,
            description: mainTopicResponse.data.description || "",
            extract: formatAsPoints(mainTopicResponse.data.extract || ""),
            url: mainTopicResponse.data.content_urls?.desktop?.page || "",
            thumbnail: mainTopicResponse.data.thumbnail?.source || null
          };
          
          const relatedPromises = [];
          for (let i = 1; i < Math.min(4, titles.length); i++) {
            relatedPromises.push(
              axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[i])}`, { headers })
                .catch(error => {
                  console.error(`Error fetching related topic ${titles[i]}:`, error.message);
                  return null;
                })
            );
          }
          
          const relatedResponses = await Promise.allSettled(relatedPromises);
          const relatedTopics = relatedResponses
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => {
              const data = result.value.data;
              return {
                title: data.title,
                description: data.description || "",
                summary: formatAsPoints(data.extract || ""),
                url: data.content_urls?.desktop?.page || "",
                thumbnail: data.thumbnail?.source || null
              };
            });
          
          const research = {
            mainTopic,
            relatedTopics
          };
          
          return res.json({ research });
          
        } catch (detailError) {
          console.error("Error fetching detailed content:", detailError.message);
          
          const mainTopic = {
            title: titles[0],
            description: descriptions[0] || "",
            extract: formatAsPoints(descriptions[0] || ""),
            url: urls[0] || "",
            thumbnail: null
          };
          
          const relatedTopics = [];
          for (let i = 1; i < Math.min(4, titles.length); i++) {
            relatedTopics.push({
              title: titles[i],
              description: descriptions[i] || "",
              summary: formatAsPoints(descriptions[i] || ""),
              url: urls[i] || "",
              thumbnail: null
            });
          }
          
          const research = {
            mainTopic,
            relatedTopics
          };
          
          return res.json({ research });
        }

      } catch (searchError) {
        console.error("Error performing search:", searchError.message);
        return res.status(404).json({ error: "Could not find content for the specified topic" });
      }

    } catch (error) {
      console.error("General error:", error.message);
      console.error(error.stack);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  function formatAsPoints(text) {
    if (!text) return [];

    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences.slice(0, 4).map(sentence => `• ${sentence.trim()}`);
  }

  return router;
};

export default researchRoute;