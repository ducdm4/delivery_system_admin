import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3002';

export const socket = io(URL, {
  autoConnect: true,
});
