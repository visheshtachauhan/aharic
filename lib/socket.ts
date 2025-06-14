import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Global variable to hold the socket instance
let io: SocketIOServer | null = null;

export const initSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!io) {
    console.log('Initializing Socket.IO server...');
    
    // Create a new Socket.IO server if one doesn't exist
    io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      // Join a room based on restaurant ID
      socket.on('join-restaurant', (restaurantId: string) => {
        socket.join(`restaurant-${restaurantId}`);
        console.log(`Socket ${socket.id} joined restaurant-${restaurantId}`);
      });
      
      // Join a room based on order ID for customers tracking their orders
      socket.on('join-order', (orderId: string) => {
        socket.join(`order-${orderId}`);
        console.log(`Socket ${socket.id} joined order-${orderId}`);
      });
      
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
    
    // Assign to the server object
    res.socket.server.io = io;
  }
  
  return res.socket.server.io;
}; 