import db from '../helpers/db.js';

export const createBlog = async (blogData) => {
  const [id] = await db('blogs').insert(blogData);
  return await getBlogById(id);
};

export const getBlogById = async (id) => {
  return await db('blogs').where({ id }).first();
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