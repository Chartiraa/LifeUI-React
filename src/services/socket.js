import { io } from 'socket.io-client';

// .env dosyasındaki IP adresini kullanma
const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.REACT_APP_LOCAL_IP_ADDRESS;

export const socket = io(URL);
