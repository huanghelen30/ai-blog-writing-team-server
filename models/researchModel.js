import db from '../helpers/db.js';

export const saveResearchData = async (id, researchEntry) => {
  try {
    if (!id) {
      console.error("Blog ID is missing");
      return { success: false, message: "Blog ID is missing" };
    }

    const existingEntry = await db('research_data').where('blog_id', id).first();

    if (existingEntry) {
      await db('research_data').where('blog_id', id).update(researchEntry);
      return { success: true, message: "Research entry updated" };
    } else {
      await db('research_data').insert({ blog_id: id, ...researchEntry });
      return { success: true, message: "Research entry created" };
    }

  } catch (error) {
    console.error("[saveResearchData] Error:", error);
    return { success: false, message: "Failed to save research entry", error: error.message }; 
  }
};

export const getResearchData = async (id) => {
  try {
    if (!id) {
      console.error("Blog ID is missing");
      return { success: false, message: "Blog ID is missing" };
    }

    const researchData = await db('research_data').where('blog_id', id).first();
    return researchData;

  } catch (error) {
    return { success: false, message: "Failed to fetch research data", error: error.message }; 
  }
};
