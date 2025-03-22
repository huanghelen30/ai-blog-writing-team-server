import db from '../helpers/db.js';

export const saveResearchData = async (id, researchEntry) => {
  try {
    if (!id) {
      console.error("Blog ID is missing");
      return { success: false, message: "Blog ID is missing" };  // Return message to caller
    }

    // Log the data being passed
    console.log("[saveResearchData] Checking existing research for blogId:", id);

    // Check if research entry already exists
    const existingEntry = await db('research_data').where('blog_id', id).first();

    if (existingEntry) {
      console.log("[saveResearchData] Found existing entry. Updating research data...");

      // Update existing entry
      const updateResult = await db('research_data').where('blog_id', id).update(researchEntry);
      console.log("[saveResearchData] Update result:", updateResult);
    } else {
      console.log("[saveResearchData] No existing entry found. Inserting new research data...");

      // Insert new entry
      const insertResult = await db('research_data').insert({ blog_id: id, ...researchEntry });
      console.log("[saveResearchData] Insert result:", insertResult);
    }

    // Return success message
    return { success: true, message: "Research entry saved" };
  } catch (error) {
    console.error("[saveResearchData] Error:", error);
    return { success: false, message: "Failed to save research entry", error: error.message }; // Return error message
  }
};
