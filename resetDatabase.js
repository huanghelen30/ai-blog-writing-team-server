#!/usr/bin/env node

/**
 * Database Reset and Reseed Script
 * Clears all data and reseeds with sample entries
 */

import db from './helpers/db.js';
import "dotenv/config";

async function resetDatabase() {
  console.log('🗑️  Starting database reset...\n');

  try {
    // Check if database connection works
    console.log('1. Testing database connection...');
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful\n');

    // Clear all data from tables (in correct order due to foreign keys)
    console.log('2. Clearing existing data...');
    
    // Clear research_data first (has foreign key to blogs)
    await db('research_data').del();
    console.log('   ✅ Cleared research_data table');
    
    // Clear blogs table
    await db('blogs').del();
    console.log('   ✅ Cleared blogs table');
    
    console.log('✅ All data cleared successfully\n');

    // Reseed with sample data
    console.log('3. Reseeding with sample data...');
    
    // Insert sample blogs
    const blogIds = await db('blogs').insert([
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

    console.log('   ✅ Inserted 9 sample blogs');

    // Insert sample research data
    const blogs = await db('blogs').select('id');
    
    await db('research_data').insert([
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

    console.log('   ✅ Inserted 9 sample research entries');

    // Verify the data
    console.log('\n4. Verifying data...');
    const blogCount = await db('blogs').count('* as count').first();
    const researchCount = await db('research_data').count('* as count').first();
    
    console.log(`   📊 Blogs: ${blogCount.count} entries`);
    console.log(`   📊 Research data: ${researchCount.count} entries`);

    console.log('\n🎉 Database reset and reseed completed successfully!');
    console.log('\n📋 Sample data includes:');
    console.log('   • 9 blog topics (AI, ML, Blockchain, Data Science, etc.)');
    console.log('   • 9 corresponding research entries');
    console.log('   • All entries are in "draft" status');

  } catch (error) {
    console.error('❌ Error during database reset:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the reset
resetDatabase();
