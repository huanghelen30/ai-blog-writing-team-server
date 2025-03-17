import { getDbConnection } from './db';

export const updateDraftContent = async (blogId, updatedDraft) => {
  const db = await getDbConnection();
  const result = await db.collection('drafts').updateOne(
    { blogId },
    { $set: { content: updatedDraft.content, lastUpdated: new Date() } }
  );
  return result;
};
