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
        {
            blog_id: blogs[3].id,
            source: 'Data Science Insights',
            content: 'Data science combines statistics, computer science, and domain knowledge...',
        },
        {
            blog_id: blogs[4].id,
            source: 'Cybersecurity Today',
            content: 'The world is seeing a surge in cyber attacks, making cybersecurity a key concern...',
        },
        {
            blog_id: blogs[5].id,
            source: 'Cloud Computing Review',
            content: 'Cloud services offer businesses flexibility, cost savings, and scalability...',
        },
        {
            blog_id: blogs[6].id,
            source: 'VR World',
            content: 'Virtual reality is enhancing experiences in gaming, education, and healthcare...',
        },
        {
            blog_id: blogs[7].id,
            source: 'Quantum Computing Weekly',
            content: 'Quantum computing promises to solve problems that are currently unsolvable...',
        },
        {
            blog_id: blogs[8].id,
            source: '5G Network Solutions',
            content: '5G will bring about faster speeds and better connectivity, changing mobile networks...',
        },
    ]);
    
    console.log('Inserted research data for blogs.');
}
