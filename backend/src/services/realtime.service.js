import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export class RealtimeService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.use(this.authenticateSocket);
    this.setupEventHandlers();
  }

  // Authenticate socket connections
  authenticateSocket = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  };

  // Set up all socket event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.user.id}`);

      // Join personal room
      socket.join(`user:${socket.user.id}`);

      // Handle chat messages
      socket.on('send_message', this.handleChatMessage(socket));

      // Handle collaborative mood board
      socket.on('mood_board_update', this.handleMoodBoardUpdate(socket));

      // Handle virtual photoshoot
      socket.on('virtual_shoot_action', this.handleVirtualShootAction(socket));

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.id}`);
      });
    });
  }

  // Handle chat messages
  handleChatMessage = (socket) => async (data) => {
    try {
      const { recipientId, message, attachments } = data;
      
      // Save message to database
      // ... implementation for saving message

      // Emit message to recipient
      this.io.to(`user:${recipientId}`).emit('new_message', {
        senderId: socket.user.id,
        message,
        attachments,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  };

  // Handle mood board updates
  handleMoodBoardUpdate = (socket) => async (data) => {
    try {
      const { boardId, update } = data;
      
      // Save mood board update
      // ... implementation for saving mood board update

      // Emit update to all users viewing the board
      this.io.to(`board:${boardId}`).emit('mood_board_updated', {
        userId: socket.user.id,
        update,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling mood board update:', error);
      socket.emit('error', { message: 'Failed to update mood board' });
    }
  };

  // Handle virtual photoshoot actions
  handleVirtualShootAction = (socket) => async (data) => {
    try {
      const { sessionId, action } = data;
      
      // Process virtual shoot action
      // ... implementation for processing virtual shoot action

      // Emit action to all participants in the session
      this.io.to(`session:${sessionId}`).emit('virtual_shoot_update', {
        userId: socket.user.id,
        action,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling virtual shoot action:', error);
      socket.emit('error', { message: 'Failed to process virtual shoot action' });
    }
  };

  // Send notification to specific user
  sendNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Broadcast event to all connected clients
  broadcastEvent(event, data) {
    this.io.emit(event, data);
  }
}
