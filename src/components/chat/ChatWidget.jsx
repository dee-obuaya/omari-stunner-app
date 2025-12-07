/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../../constants/ServerUrl';
import ChatBox from './ChatBox';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [ sessionId, setSessionId] = useState(null);

    // load existing session or create new one
    useEffect(() => {
        const existing = localStorage.getItem('chat_sessionId');
        if (existing) setSessionId(existing);
    }, []);

    // init socket when sessionId exists
    useEffect(() => {
        if (!sessionId) return;

        const s = io(SOCKET_URL, {
            query: {sessionId},
            transports: ['websocket'],
        });

        s.on('connect', () => {
            console.log('Emitting user:join', sessionId);
            s.emit('user:join', {
                sessionId,
                userAgent: navigator.userAgent,
            });
        });

        s.on('user:sessionId', ({sessionId: newId }) => {
            console.log('received sessionId: ', newId);
            setSessionId(newId);
            localStorage.setItem('chat_sessionId', newId);
        })

        setSocket(s);

        return () => s.disconnect();
    }, [sessionId]);

    // create new session from api
    const startNewChat = async () => {
        const res = await fetch(`${API_BASE_URL}/api/chats/visitor/start`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });

        const data = await res.json();
        console.log(data)
        setSessionId(data.sessionId);
        localStorage.setItem('chat_sessionId', data.sessionId);
    };

    // click handler
    const toggleChat = async () => {
        if (!sessionId) {
            await startNewChat();
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* floating chat button */}
            <div className='fab'>
                <button
                    onClick={toggleChat}
                    className='fixed bottom-5 right-5 btn btn-lg btn-circle btn-primary shadow-lg transition-transform active:scale-95'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'height='24'viewBox='0 0 24 24'
                        fill='none' stroke='currentColor'
                        strokeWidth='2' strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-message-circle-icon lucide-message-circle'
                    >
                        <path d='M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719'/>
                    </svg>
                </button>
            </div>

            {/* chat window */}
            {isOpen && sessionId && (
                <ChatBox
                    socket={socket}
                    sessionId={sessionId}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    )
};