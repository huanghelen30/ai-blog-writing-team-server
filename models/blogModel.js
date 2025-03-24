import db from '../helpers/db.js';

export const getAllBlogs = async () => {
  return await db('blogs').select('*').orderBy('created_at');
};

export const getBlogById = async (id) => {
  return await db.select('*').from('blogs').where({ id }).first();
};

export const createBlog = async (blogData) => {
  return await db('blogs').insert(blogData);
};

export const updateBlog = async (id, blogData) => {
  return await db('blogs').where({ id }).update(blogData);
};

export const getBlogTopicById = async (id) => {
  return await db.select('selectedTopic').from('blogs').where('id', id).first();
};

export const getResearchByBlogId = async (id) => {
  return await db('research_data').where('blog_id', id).first();
};