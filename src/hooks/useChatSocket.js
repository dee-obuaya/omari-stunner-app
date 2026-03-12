/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import { API_BASE_URL } from '../constants/ServerUrl';

export default function useChatSocket() {
    const socketRef = useRef(null);

    const [sessionId, setSessionId] = useState(null);
    const [adminOnline, setAdminOnline] = useState(false);

    // -----------------------------------------------
    // Create session when chat opens
    // -----------------------------------------------
    const startSession = async () => {
        if (sessionId) return sessionId;

        const res = await fetch(`${API_BASE_URL}/api/chats/visitor/start`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        const data = await res.json();

        const newSessionId = data.sessionId;

        setSessionId(newSessionId);

        return newSessionId;
    };

    useEffect(() => {
        if (!sessionId) return;

        const socket = io(API_BASE_URL, {
            auth: { role: 'visitor' },
            withCredentials: true,
        });

        socketRef.current = socket;

        // connection debug
        socket.on('connect', () => {
            console.log('Visitor socket connected: ', socket.id);

            socket.emit('user:join', { sessionId });
        });

        socket.on('user:joined', (data) => {
            console.log('Visitor joined session: ', data.sessionId);
        });

        socket.on('admin:status', (data) => {
            console.log('Admin status: ', data.online);
            setAdminOnline(data.online);
        });

        socket.on('disconnect', () => {
            console.log('Visitor socket disconnected');
        });

        return () => {
            socket.disconnect();
        }
    }, [sessionId]);

    return {
        socket: socketRef.current,
        sessionId,
        adminOnline,
        startSession,
    };
}