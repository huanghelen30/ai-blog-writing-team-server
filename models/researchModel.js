import db from '../helpers/db.js';

export const saveResearchData = async (blogId, researchData) => {
  try {
    return await db('research_data').insert({
      blog_id: blogId,
      source: researchData.source,
      content: researchData.content
    });
  } catch (error) {
    console.error('Error saving research data:', error);
    throw error;
  }
};

export const getResearchByBlogId = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }
    
    console.log('Database query for blogId:', blogId);
    
    const result = await db.select('*').from('research_data').where('blog_id', '=', blogId);
    
    console.log('Database query result count:', result.length);
    
    return result;
  } catch (error) {
    console.error('Error in getResearchByBlogId:', error);
    throw error;
  }
};