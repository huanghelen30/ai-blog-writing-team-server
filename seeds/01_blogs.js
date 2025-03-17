import { v4 as uuidv4 } from 'uuid';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('research_data').del();
    await knex('blogs').del();

    const blogIds = await knex('blogs').insert([
        {
            blogId: uuidv4(),
            title: 'Introduction to Artificial Intelligence',
            selectedTopic: 'Artificial Intelligence',
            content: 'This is an introductory blog about AI...',
            status: 'draft',
        },
        {
            blogId: uuidv4(),
            title: 'The Future of Machine Learning',
            selectedTopic: 'Machine Learning',
            content: 'In this post, we will explore the future of machine learning...',
            status: 'draft',
        },
        {
            blogId: uuidv4(),
            title: 'How Blockchain Will Change the World',
            selectedTopic: 'Blockchain',
            content: 'Blockchain technology is set to revolutionize industries...',
            status: 'published',
        },
    ], ['id']);

    console.log('Inserted Blog IDs:', blogIds);
}
