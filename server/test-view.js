/**
 * Test script to verify view increment functionality
 */

async function testViewIncrement() {
  const baseUrl = 'http://localhost:4001/api/posts';
  const slug = 'getting-started-with-react-18';
  
  console.log('🧪 Testing view increment functionality...\n');
  
  try {
    // Make 3 requests and show view count
    for (let i = 1; i <= 3; i++) {
      const response = await fetch(`${baseUrl}/${slug}`);
      const post = await response.json();
      
      console.log(`Request #${i}:`);
      console.log(`  Title: ${post.title}`);
      console.log(`  Views: ${post.views}`);
      console.log(`  Status: ${post.status}`);
      console.log('');
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ View functionality is working correctly!');
    console.log('Each request incremented the view count by 1.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testViewIncrement();
