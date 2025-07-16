import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { createLogger } from './logger';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

const logger = createLogger('socket-service');

// Global variable to hold the socket instance
let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: NetServer) {
  try {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      logger.info('Client connected', { socketId: socket.id });
      
      // Join a room based on restaurant ID
      socket.on('join-restaurant', (restaurantId: string) => {
        socket.join(`restaurant-${restaurantId}`);
        logger.info(`Socket ${socket.id} joined restaurant-${restaurantId}`);
      });
      
      // Join a room based on order ID for customers tracking their orders
      socket.on('join-order', (orderId: string) => {
        socket.join(`order-${orderId}`);
        logger.info(`Socket ${socket.id} joined order-${orderId}`);
      });
      
      socket.on('disconnect', () => {
        logger.info('Client disconnected', { socketId: socket.id });
      });

      socket.on('error', (error) => {
        logger.error('Socket error', { error, socketId: socket.id });
      });
    });

    logger.info('Socket server initialized successfully');
    return io;
  } catch (error) {
    logger.error('Failed to initialize socket server', { error });
    throw error;
  }
}

export function getSocketServer() {
  if (!io) {
    throw new Error('Socket server not initialized');
  }
  return io;
}

export function emitEvent(event: string, data: unknown) {
  try {
    if (!io) {
      throw new Error('Socket server not initialized');
    }
    io.emit(event, data);
    logger.debug('Event emitted', { event, data });
  } catch (error) {
    logger.error('Failed to emit event', { error, event, data });
    throw error;
  }
} 