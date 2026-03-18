/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import { API_BASE_URL } from '../constants/ServerUrl';

export default function useChatSocket() {
    const socketRef = useRef(null);
    const sessionRef = useRef(null);

    const [sessionId, setSessionId] = useState(null);
    const [adminOnline, setAdminOnline] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        sessionRef.current = sessionId;
    }, [sessionId]);

    useEffect(() => {
        if (!socketRef.current || !sessionId) return;

        console.log('🔁 Joining room after sessionId set:', sessionId);

        socketRef.current.emit('user:join', { sessionId });
    }, [sessionId]);

    useEffect(() => {
        // if (!sessionId) return;

        const socket = io(API_BASE_URL, {
            auth: { role: 'visitor' },
            withCredentials: true,
        });

        socketRef.current = socket;

        // connection debug
        socket.on('connect', () => {
            console.log('Visitor socket connected: ', socket.id);

            // if (sessionId) socket.emit('user:join', { sessionId });
        });

        socket.on('user:joined', (data) => {
            console.log('Visitor joined session: ', data.sessionId);
        });

        socket.on('session:created', (data) => {
            console.log('Session created: ', data.sessionId);

            setSessionId(data.sessionId);

            // socket.emit('user:join', { sessionId: data.sessionId });
        })

        socket.on('chat:message', (msg) => {
            setMessages(prev => [...prev,
                {
                    ...msg,
                    sessionId: msg.sessionId?.toString?.() || msg.sessionId,
                    status: msg.status || 'sent'
                }
            ]);
        });

        socket.on('chat:history', (msgs) => {
            console.log('📜 Visitor history:', msgs);

            const normalized = msgs.map(msg => ({
                ...msg,
                sessionId: msg.sessionId?.toString?.() || msg.sessionId,
                status: msg.status || 'sent'
            }));

            setMessages(normalized);
        });

        socket.on('admin:status', (data) => {
            console.log('Admin status: ', data.online);
            setAdminOnline(data.online);
        });

        socket.on('message:status', ({ sessionId, status }) => {
            const statusPriority = {
                sent: 1,
                delivered: 2,
                seen: 3
            };

            setMessages(prev =>
                prev.map(msg => {
                    if (msg.sender !== 'visitor') return msg;

                    const isSameSession = sessionId
                        ? msg.sessionId === sessionId
                        : true;

                    if (!isSameSession) return msg;

                    const current = statusPriority[msg.status] || 0;
                    const incoming = statusPriority[status] || 0;

                    // 🚫 block downgrade
                    if (incoming < current) return msg;

                    return { ...msg, status };
                })
            );
        });

        socket.on('disconnect', () => {
            console.log('Visitor socket disconnected');
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    const sendMessage = (message) => {
        if (!socketRef.current) return;

        console.log('(hook)Emitting message: ', message);

        socketRef.current.emit('user:sendMessage', {
            sessionId: sessionRef.current,
            message
        });
    };

    return {
        socket: socketRef.current,
        sessionId,
        adminOnline,
        messages,
        sendMessage,
    };
}