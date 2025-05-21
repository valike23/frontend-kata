// src/lib/socket.ts
import { browser } from '$app/environment';
import { io, Socket } from 'socket.io-client';

let socket: Socket|null = null;

if (browser) {
  // point to your backend URL (adjust port/domain as needed)
  socket = io('http://localhost:3000', {
    transports: ['websocket'], // optional, but speeds up connection
    // auth: { token: 'user-jwt' } // if you need auth
  });
}

export { socket };
