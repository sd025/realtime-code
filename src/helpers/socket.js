import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export const initSocket = async () => {
    const option = {
        forceNew: true,
        reconnectionAttempts: 10000,
        timeout: 10000,
        transports: ['websocket']
    };

    return io("https://codeonline-server.herokuapp.com/", option);
};
