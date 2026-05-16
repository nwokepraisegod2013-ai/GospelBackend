import logger from '../utils/logger.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    // Join a room for a specific content item
    socket.on('join-content', (contentId, userId) => {
      socket.join(`content-${contentId}`);
      io.to(`content-${contentId}`).emit('user-joined', {
        userId,
        socketId: socket.id,
        timestamp: new Date(),
      });
      logger.info(`User ${userId} joined content room: ${contentId}`);
    });
    
    // Leave room
    socket.on('leave-content', (contentId, userId) => {
      socket.leave(`content-${contentId}`);
      io.to(`content-${contentId}`).emit('user-left', {
        userId,
        timestamp: new Date(),
      });
      logger.info(`User ${userId} left content room: ${contentId}`);
    });
    
    // New message in chat
    socket.on('new-message', (contentId, message) => {
      io.to(`content-${contentId}`).emit('message', {
        ...message,
        timestamp: new Date(),
      });
      logger.info(`New message in ${contentId} from ${message.author}`);
    });
    
    // Like update
    socket.on('like-update', (contentId, likeData) => {
      io.to(`content-${contentId}`).emit('likes-updated', likeData);
    });
    
    // View count update
    socket.on('view-update', (contentId, viewCount) => {
      io.to(`content-${contentId}`).emit('views-updated', { views: viewCount });
    });
    
    // Typing indicator
    socket.on('typing', (contentId, userData) => {
      socket.to(`content-${contentId}`).emit('user-typing', userData);
    });
    
    socket.on('stop-typing', (contentId, userData) => {
      socket.to(`content-${contentId}`).emit('user-stopped-typing', userData);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
    
    // Error handling
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}`, error);
    });
  });
  
  return io;
};

export default setupSocketHandlers;
