#!/usr/bin/env node

/**
 * Database Check Script
 * Shows current database contents
 */

import knex from 'knex';
import config from './knexfile.js';
import "dotenv/config";

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

async function checkDatabase() {
  console.log('📊 Checking database contents...\n');

  try {
    // Check blogs
    console.log('📝 BLOGS:');
    const blogs = await db('blogs').select('id', 'selectedTopic', 'status', 'created_at');
    
    if (blogs.length === 0) {
      console.log('   No blogs found');
    } else {
      blogs.forEach(blog => {
        console.log(`   ${blog.id}. ${blog.selectedTopic} (${blog.status}) - ${blog.created_at}`);
      });
    }

    console.log(`\n   Total blogs: ${blogs.length}`);

    // Check research data
    console.log('\n🔬 RESEARCH DATA:');
    const research = await db('research_data')
      .select('research_data.research_data_id', 'research_data.blog_id', 'research_data.source', 'research_data.content', 'blogs.selectedTopic as topic')
      .join('blogs', 'research_data.blog_id', 'blogs.id');
    
    if (research.length === 0) {
      console.log('   No research data found');
    } else {
      research.forEach(item => {
        const preview = item.content.substring(0, 50) + '...';
        console.log(`   ${item.research_data_id}. ${item.topic} (${item.source})`);
        console.log(`      ${preview}`);
      });
    }

    console.log(`\n   Total research entries: ${research.length}`);

    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`   • ${blogs.length} blog entries`);
    console.log(`   • ${research.length} research entries`);
    console.log(`   • Database is ${blogs.length > 0 ? 'populated' : 'empty'}`);

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await db.destroy();
  }
}

checkDatabase();
