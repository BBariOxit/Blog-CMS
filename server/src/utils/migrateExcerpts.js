/**
 * migrateExcerpts.js
 * Migration script to add excerpt to existing posts
 */

import Post from '../models/Post.js';
import { generateExcerpt } from './buildContent.js';
import mongoose from 'mongoose';
import appConfig from '../config/AppConfig.js';

async function migrateExcerpts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(appConfig.mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('\n📝 Finding posts without excerpts...');
    const posts = await Post.find({ 
      $or: [
        { excerpt: { $exists: false } },
        { excerpt: '' }
      ]
    });

    console.log(`📊 Found ${posts.length} posts to update`);

    let updated = 0;
    for (const post of posts) {
      if (post.contentMarkdown) {
        const excerpt = generateExcerpt(post.contentMarkdown, 200);
        post.excerpt = excerpt;
        await post.save();
        updated++;
        console.log(`✅ Updated post: ${post.title}`);
      } else {
        console.log(`⚠️  Skipped post (no content): ${post.title}`);
      }
    }

    console.log(`\n🎉 Migration completed! Updated ${updated} posts`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration
migrateExcerpts();
