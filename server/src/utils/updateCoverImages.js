/**
 * updateCoverImages.js
 * Script to add beautiful tech cover images to posts without images
 */

import Post from '../models/Post.js';
import mongoose from 'mongoose';
import appConfig from '../config/AppConfig.js';

// Beautiful tech images from Unsplash
const techImages = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop&q=80', // React code
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&q=80', // Programming
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80', // Code on screen
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&q=80', // Code editor
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80', // Tech workspace
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=600&fit=crop&q=80', // Database
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&h=600&fit=crop&q=80', // Node.js
  'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop&q=80', // CSS/Design
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop&q=80', // TypeScript
  'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop&q=80', // Docker
  'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=600&fit=crop&q=80', // Git
];

async function updateCoverImages() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(appConfig.mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('\n🖼️  Finding posts without cover images...');
    const posts = await Post.find({
      $or: [
        { coverImage: { $exists: false } },
        { coverImage: '' }
      ]
    });

    console.log(`📊 Found ${posts.length} posts to update`);

    let updated = 0;
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      // Assign random tech image
      const randomImage = techImages[i % techImages.length];
      post.coverImage = randomImage;
      await post.save();
      updated++;
      console.log(`✅ Updated post: ${post.title}`);
    }

    console.log(`\n🎉 Update completed! Updated ${updated} posts with cover images`);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run update
updateCoverImages();
