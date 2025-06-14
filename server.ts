import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new SocketServer(server, {
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

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 