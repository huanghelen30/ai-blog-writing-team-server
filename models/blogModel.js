import db from '../helpers/db.js';

export const createBlog = async (blogData) => {
  const [id] = await db('blogs').insert(blogData);
  return await getBlogById(id);
};

export const getBlogTopicById = async (id) => {
  try {
    console.log(`[getBlogTopicById] Fetching blog topic for blogId: ${id}`);

    const blogTopic = await db.select('selectedTopic').from('blogs').where('id', id).first();

    console.log(`[getBlogTopicById] Fetched blog topic:`, blogTopic);

    return blogTopic;
  } catch (error) {
    console.error(`[getBlogTopicById] Error fetching blog topic for blogId ${id}:`, error);
    throw error;
  }
};

export const getResearchByBlogId = async (blogId) => {
  try {
    console.log(`[getResearchByBlogId] Fetching research for blogId: ${blogId}`);
    const research = await db('research_data').where('blog_id', blogId).first();
    
    console.log(`[getResearchByBlogId] Retrieved research:`, research);
    return research;
  } catch (error) {
    console.error(`[getResearchByBlogId] Error:`, error);
    return null;
  }
};


export const getBlogById = async (id) => {
  return await db.select('*').from('blogs').where({ id }).first();
};

export const updateBlog = async (id, blogData) => {
  await db('blogs').where({ id }).update(blogData);
  return await getBlogById(id);
};

export const getAllBlogs = async () => {
  return await db('blogs').select('*').orderBy('created_at', 'desc');
};

export const deleteBlog = async (id) => {
  const deletedRows = await db('blogs').where({ id }).del();
  return deletedRows > 0;
};