import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import config from '../config';

export function useSocket(token) {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(config.serverHost, {
            auth: token ? { token } : {},
        });

        socketRef.current = socket;

        return () => socket.disconnect();
    }, [token]);

    return socketRef;
}
