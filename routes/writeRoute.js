import express from "express";

const writeRoute = (client) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { prompt } = req.body; // Get the prompt from the request body

      // Generate a piece of content based on the user-provided prompt
      const writeCompletion = await client.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "user",
            content: `Write a detailed article based on the following prompt: ${prompt}. Make sure the content is clear, well-structured, and informative, with an engaging introduction and conclusion. Avoid unnecessary fluff and keep it concise.`,
          },
        ],
        provider: "sambanova",
        max_tokens: 1000, // You can adjust the token limit based on the expected length of the content
      });

      // Extract the generated content from the response
      const content = writeCompletion.choices[0].message.content.trim();

      res.json({
        content: content, // Return the content to the client
      });
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle any errors
    }
  });

  return router;
};

export default writeRoute;
