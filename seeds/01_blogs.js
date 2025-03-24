/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('research_data').del();
    await knex('blogs').del();

    const blogIds = await knex('blogs').insert([
        {
            selectedTopic: 'Artificial Intelligence',
            content: 'This is an introductory blog about AI...',
            status: 'draft',
        },
        {
            selectedTopic: 'Machine Learning',
            content: 'In this post, we will explore the future of machine learning...',
            status: 'draft',
        },
        {
            selectedTopic: 'Blockchain',
            content: 'Blockchain technology is set to revolutionize industries...',
            status: 'draft',
        },
        {
            selectedTopic: 'Data Science',
            content: 'Data science is a multidisciplinary field that uses scientific methods...',
            status: 'draft',
        },
        {
            selectedTopic: 'Cybersecurity',
            content: 'As the world becomes more connected, cybersecurity is more important than ever...',
            status: 'draft',
        },
        {
            selectedTopic: 'Cloud Computing',
            content: 'Cloud computing has revolutionized how we manage and store data...',
            status: 'draft',
        },
        {
            selectedTopic: 'Virtual Reality',
            content: 'Virtual reality is no longer just a concept; it is transforming industries...',
            status: 'draft',
        },
        {
            selectedTopic: 'Quantum Computing',
            content: 'Quantum computing is opening new doors in technology and problem solving...',
            status: 'draft',
        },
        {
            selectedTopic: '5G Technology',
            content: 'The rollout of 5G technology is expected to change the connectivity landscape...',
            status: 'draft',
        },
    ], ['id']);

    console.log('Inserted Blog IDs:', blogIds);
}
