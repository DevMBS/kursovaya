// useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(token) {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io('http://localhost:8000', {
            auth: token ? { token } : {},
        });

        socketRef.current = socket;

        return () => socket.disconnect();
    }, [token]);

    return socketRef;
}
