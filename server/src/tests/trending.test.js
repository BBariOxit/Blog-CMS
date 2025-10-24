/**
 * trending.test.js
 * Test Strategy Pattern - Trending Ranking
 */

import TrendingContext from '../services/Trending/TrendingContext.js';
import ByViewsStrategy from '../services/Trending/ByViewsStrategy.js';
import ByVelocityStrategy from '../services/Trending/ByVelocityStrategy.js';
import ByWeightedEngagementStrategy from '../services/Trending/ByWeightedEngagementStrategy.js';

describe('Strategy Pattern - Trending Ranking', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'Post A',
      views: 100,
      likes: 10,
      commentsCount: 5,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      _id: '2',
      title: 'Post B',
      views: 200,
      likes: 5,
      commentsCount: 2,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
      _id: '3',
      title: 'Post C',
      views: 50,
      likes: 20,
      commentsCount: 10,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  test('ByViewsStrategy should rank by views descending', () => {
    const context = new TrendingContext(new ByViewsStrategy());
    const result = context.getTrending(mockPosts, 10);

    expect(result[0]._id).toBe('2'); // 200 views
    expect(result[1]._id).toBe('1'); // 100 views
    expect(result[2]._id).toBe('3'); // 50 views
  });

  test('ByVelocityStrategy should rank by views/age', () => {
    const context = new TrendingContext(new ByVelocityStrategy());
    const result = context.getTrending(mockPosts, 10);

    // Post C: 50 views / 12 hours ≈ 4.17 views/hour (highest)
    // Post A: 100 views / 24 hours ≈ 4.17 views/hour
    // Post B: 200 views / 48 hours ≈ 4.17 views/hour (lowest)
    expect(result[0]._id).toBe('3'); // Newest with decent views
  });

  test('ByWeightedEngagementStrategy should rank by weighted score', () => {
    const context = new TrendingContext(new ByWeightedEngagementStrategy());
    const result = context.getTrending(mockPosts, 10);

    // Post A: 100 + 5*10 + 3*5 = 165
    // Post B: 200 + 5*5 + 3*2 = 231
    // Post C: 50 + 5*20 + 3*10 = 180

    expect(result[0]._id).toBe('2'); // Score 231
    expect(result[1]._id).toBe('3'); // Score 180
    expect(result[2]._id).toBe('1'); // Score 165
  });

  test('should limit results to specified number', () => {
    const context = new TrendingContext(new ByViewsStrategy());
    const result = context.getTrending(mockPosts, 2);

    expect(result.length).toBe(2);
  });

  test('should allow switching strategies', () => {
    const context = new TrendingContext();

    // Set views strategy
    context.setStrategy(new ByViewsStrategy());
    let result = context.getTrending(mockPosts, 10);
    expect(result[0]._id).toBe('2');

    // Switch to weighted strategy
    context.setStrategy(new ByWeightedEngagementStrategy());
    result = context.getTrending(mockPosts, 10);
    expect(result[0]._id).toBe('2');
  });

  test('should throw error if no strategy set', () => {
    const context = new TrendingContext();

    expect(() => {
      context.getTrending(mockPosts, 10);
    }).toThrow('Strategy chưa được set');
  });
});
