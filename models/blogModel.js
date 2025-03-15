import db from '../db.js';

export const createBlog = async (blogData) => {
  return await db('blogs').insert(blogData).returning('*');
};

export const getBlogById = async (id) => {
  return await db('blogs').where({ id }).first();
};

export const updateBlog = async (id, blogData) => {
  return await db('blogs').where({ id }).update(blogData).returning('*');
};

export const getAllBlogs = async () => {
  return await db('blogs').select('*').orderBy('created_at', 'desc');
};

export const deleteBlog = async (id) => {
  return await db('blogs').where({ id }).del();
};