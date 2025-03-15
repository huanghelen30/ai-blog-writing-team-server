import db from '../db.js';

export const saveResearchData = async (researchData) => {
  return await db('research_data').insert(researchData).returning('*');
};

export const getResearchByBlogId = async (blogId) => {
  return await db('research_data').where({ blog_id: blogId }).select('*');
};

export const deleteResearchData = async (id) => {
  return await db('research_data').where({ id }).del();
};