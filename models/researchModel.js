import db from '../helpers/db.js';

export const saveResearchData = async (blogId, researchEntry) => {
  try {
    if (!blogId) {
      console.error("Blog ID is missing");
      return;
    }

    console.log("Attempting to save research data:", researchEntry); // Log data before insertion

    const result = await db('research_data').where('blog_id', blogId).first();
    console.log("Database Insert Result:", result); // Log DB response

    return result;
  } catch (error) {
    console.error('Error saving research data:', error);
  }
};


export const getBlogTopicById = async (blogId) => {
  try {
    console.log("Received blogId:", blogId);
    if (!blogId) {
      console.error("blogId is undefined or null");
      return null;
    }

    const result = await db
      .select('selectedTopic')
      .from('blogs')
      .where('id', blogId)
      .first();

    console.log(`Database query result for blogId ${blogId}:`, result);

    return result?.selectedTopic || null;
  } catch (error) {
    console.error("Error fetching blog topic:", error);
    return null;
  }
};


export const getResearchByBlogId = async (blogId) => {
  try {
    if (!blogId) {
      console.error('Blog ID is required');
      return;
    }

    const result = await db.select('*').from('research_data').where('blog_id', blogId);

    return result;
  } catch (error) {
    console.error('Error in getResearchByBlogId:', error);
  }
};
