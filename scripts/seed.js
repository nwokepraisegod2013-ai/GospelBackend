import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import config from '../src/config/config.js';
import User from '../src/models/User.js';
import Content from '../src/models/Content.js';
import ChatMessage from '../src/models/ChatMessage.js';
import logger from '../src/utils/logger.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB for seeding');
    
    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    await ChatMessage.deleteMany({});
    logger.info('Cleared existing data');
    
    // Create sample users
    const users = await User.create([
      {
        name: 'John Preacher',
        email: 'john@gospel.com',
        password: 'password123',
        role: 'creator',
        bio: 'Gospel preacher and teacher',
        isVerified: true,
      },
      {
        name: 'Mary Singer',
        email: 'mary@gospel.com',
        password: 'password123',
        role: 'creator',
        bio: 'Gospel music artist',
        isVerified: true,
      },
      {
        name: 'Regular User',
        email: 'user@gospel.com',
        password: 'password123',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'Admin User',
        email: 'admin@gospel.com',
        password: 'password123',
        role: 'admin',
        isVerified: true,
      },
    ]);
    
    logger.info(`Created ${users.length} users`);
    
    // Create sample content
    const content = await Content.create([
      {
        title: 'The Power of Faith',
        subtitle: 'A powerful sermon on believing in God',
        description: 'In this sermon, we explore the transformative power of faith and how it can change our lives.',
        type: 'video',
        category: 'sermon',
        thumbnailUrl: 'https://via.placeholder.com/400x300',
        contentUrl: 'https://example.com/video1.mp4',
        author: users[0]._id,
        isPublished: true,
        duration: 3600,
        likes: 145,
        views: 2500,
      },
      {
        title: 'Amazing Grace',
        subtitle: 'A beautiful rendition of the classic hymn',
        description: 'Experience the beauty of Amazing Grace performed by our gospel choir.',
        type: 'music',
        category: 'worship',
        thumbnailUrl: 'https://via.placeholder.com/400x300',
        contentUrl: 'https://example.com/music1.mp3',
        author: users[1]._id,
        isPublished: true,
        duration: 240,
        artist: 'Gospel Choir',
        album: 'Great Hymns',
        trackNumber: 1,
        genre: 'gospel',
        bitrate: 320,
        audioFormat: 'mp3',
        lyricsUrl: 'https://example.com/music1-lyrics',
        explicit: false,
        likes: 98,
        views: 1200,
      },
      {
        title: 'Daily Devotional Guide',
        subtitle: 'A comprehensive guide to daily devotions',
        description: 'Learn how to establish a meaningful daily devotional practice.',
        type: 'book',
        category: 'devotional',
        thumbnailUrl: 'https://via.placeholder.com/400x300',
        contentUrl: 'https://example.com/book1.pdf',
        author: users[0]._id,
        isPublished: true,
        likes: 67,
        views: 890,
      },
      {
        title: 'Sunday Service Live',
        subtitle: 'Join us for our weekly Sunday worship service',
        description: 'Live streaming of our Sunday morning service with worship and teaching.',
        type: 'live',
        category: 'sermon',
        thumbnailUrl: 'https://via.placeholder.com/400x300',
        contentUrl: 'https://example.com/live-stream',
        author: users[0]._id,
        isPublished: true,
        isLive: true,
        streamUrl: 'https://example.com/stream-url',
        liveStartTime: new Date(),
      },
    ]);
    
    logger.info(`Created ${content.length} content items`);
    
    // Create sample chat messages
    const messages = await ChatMessage.create([
      {
        contentId: content[0]._id,
        author: users[2]._id,
        message: 'This sermon is so inspiring! Thank you for sharing.',
      },
      {
        contentId: content[0]._id,
        author: users[1]._id,
        message: 'Amen! God bless you brother.',
      },
      {
        contentId: content[1]._id,
        author: users[2]._id,
        message: 'Beautiful song! I love this version.',
      },
    ]);
    
    logger.info(`Created ${messages.length} chat messages`);
    
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database', error);
    process.exit(1);
  }
};

seedDatabase();
