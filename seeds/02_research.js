/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('research_data').del();

    const blogs = await knex('blogs').select('id');
    
    if (!blogs.length) {
        console.log('No blogs found. Please seed the blogs table first.');
        return;
    }

    await knex('research_data').insert([
        {
            blog_id: blogs[0].id,
            source: 'AI Trends',
            content: 'AI has been growing exponentially over the past decade...',
        },
        {
            blog_id: blogs[1].id,
            source: 'Machine Learning Journal',
            content: 'Machine learning models are evolving rapidly...',
        },
        {
            blog_id: blogs[2].id,
            source: 'Blockchain Revolution',
            content: 'Blockchain is being integrated into industries like finance...',
        },
    ]);
    
    console.log('Inserted research data for blogs.');
}
