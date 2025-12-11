import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../constants/ServerUrl';

// const playNotification = () => {
//     console.log("🔊 Trying to play notification sound...");
//     const audio = new Audio('/chat-notification.mp3');
//     audio.volume = 1.0;
//     audio.play().catch(err => console.log("🚫 Audio play blocked:", err));
// };

function playNotification() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 2.5; // 🔥 BOOST (1 = normal, 2 = double, 3 = loud)

        fetch("/audio/chat_notification.mp3")
            .then(res => res.arrayBuffer())
            .then(data => audioContext.decodeAudioData(data))
            .then(buffer => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(gainNode).connect(audioContext.destination);
                source.start(0);
            });
    } catch (err) {
        console.error("Audio error:", err);
    }
}

// function playNotification() {
//     const AudioContext = window.AudioContext || window.webkitAudioContext;
//     const ctx = new AudioContext();
//     const gain = ctx.createGain();
//     gain.gain.value = 3.0; // crank it up

//     const audio = new Audio("/audio/chat_notification.mp3");

//     const track = ctx.createMediaElementSource(audio);
//     track.connect(gain).connect(ctx.destination);

//     audio.play();
// }



export default function useChatSocket () {
    // --- State ---
    const [sessionId, setSessionId] = useState(null);
    const sessionIdRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const [adminOnline, setAdminOnline] = useState(false);

    const socketRef = useRef(null);

    // tracks whether chat widget is open or minimized
    const isChatOpenRef = useRef(false);

    // ------------------------------------
    // Create new chat session
    // ------------------------------------
    const startNewChat = async () => {
        const res = await fetch(`${API_BASE_URL}/api/chats/visitor/start`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });

        const data = await res.json();

        setSessionId(data.sessionId);
        sessionIdRef.current = data.sessionId;
        localStorage.setItem('chat_sessionId', data.sessionId);

        return data.sessionId;
    };

    // ----------------------------------------------------
    // 1) INITIALIZE SOCKET — only runs once
    // ----------------------------------------------------
    useEffect(() => {
        if (socketRef.current) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        socketRef.current = socket;

        // debug helper
        socket.onAny((event, payload) => {
            console.debug('SOCKET EVENT:', event, payload);
        });

        socket.on('connect', async () => {
            console.log('Visitor connected: ', socket.id);

            // NEW GUARD: ensures the hook doesn’t double-run
            if (sessionIdRef.current) {
                console.log("⚠️ Session already restored, skipping re-init");
                return;
            }

            let existing = localStorage.getItem('chat_sessionId');

            if (existing) {
                console.log("🔄 Restoring visitor session:", existing);

                sessionIdRef.current = existing;
                setSessionId(existing);

                socket.emit('user:join', {
                    sessionId: existing,
                    userAgent: navigator.userAgent
                });
            } else {
                console.log("✨ Creating a new visitor session...");
                const newId = await startNewChat();

                socket.emit('user:join', {
                    sessionId: newId,
                    userAgent: navigator.userAgent
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('❌ Visitor socket disconnected');
        });

        // ------------------------------------------------
        // PERMANENT LISTENER — server responds with final sessionId
        // ------------------------------------------------
        socket.on('user:sessionId', async ({ sessionId }) => {
            console.log('📌 Final session ID from server:', sessionId);

            if (!sessionId) return;

            sessionIdRef.current = sessionId;
            setSessionId(sessionId);
            localStorage.setItem('chat_sessionId', sessionId);
        });

        return () => {
            if (socket.connected || socket.connecting) {
                console.log("%c🧹 Cleanup: disconnecting socket", "color: orange");
                socket.disconnect();
            } else {
                console.log("%c🧹 Cleanup: socket not connected, skipping", "color: gray");
            }
        };

    }, []);

    // --------------------------------------------------
    // Load history *WHEN* sessionId becomes available
    // --------------------------------------------------
    useEffect(() => {
        if (!sessionId) return;

        console.log('Loading history for: ', sessionId);

        // load message history after session is confirmed
        fetch(
            `${API_BASE_URL}/api/chats/visitor/${sessionId}/messages`,
            { credentials: 'include' }
        )
            .then(res => res.json())
            .then(data => {
                console.log('History loaded: ', data.messages);
                setMessages(data.messages || []);
            })
            .catch(err => console.error('History error: ', err));
    }, [sessionId]);


    // ---------------------------------
    // Socket Listeners
    // ---------------------------------
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;
        if (!socket.connected) return;
        if (!sessionId) return;


        // --- new message ---
        const handleNewMessage = msg => {
            if (msg.sessionId !== sessionIdRef.current) return;

            console.log("📩 Received new message:", msg);

            setMessages(prev => {
                const updated = [...prev, msg];
                return updated;
            });

            // unread
            if (!isChatOpenRef.current) {
                setUnread(u =>  u + 1);

                if (msg.senderType !== 'visitor') {
                    playNotification();
                }
            }

        };

        // --- receive typing ---
        const handleTyping = data => {
            if (data.sessionId !== sessionIdRef.current) return;
            if (data.senderType !== 'admin' && data.senderType !== 'employee') return;

            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 5000);
        };

        // --- message status ---
        const handleStatus = ({ messageId, status }) => {
            if (sessionId !== sessionIdRef.current) return;

            setMessages(prev =>
                prev.map(m =>
                    m._id === messageId ? { ...m, status } : m
                )
            );
        };

        // --- admin status ---
        const handleAdminStatus = ({ online }) => {
            console.log('👨‍🦱 Admin online status changed: ', online);
            setAdminOnline(online);
        };

        socket.on('message:new', handleNewMessage);
        socket.on('typing', handleTyping);
        socket.on('message:status', handleStatus);
        socket.on('admin:status', handleAdminStatus);

        return () => {
            socket.off('message:new', handleNewMessage);
            socket.off('typing', handleTyping);
            socket.off('message:status', handleStatus);
            socket.off('admin:status', handleAdminStatus);
        };
    }, [sessionId]);

    // ------ send message ------
    const sendMessage = (txt) => {
        if (!txt.trim() || !sessionIdRef.current) return;

        socketRef.current.emit('message:send',{
            sessionId: sessionIdRef.current,
            senderType: 'visitor',
            message: txt.trim(),
        });
    };

    // ------ send typing indicator ------
    const sendTyping = () => {
        if (!sessionIdRef.current) return;

        socketRef.current?.emit('typing', {
            sessionId: sessionIdRef.current,
            senderType: 'visitor',
        });
    };


    // ------ send message ------
    // const sendMessage = useCallback(
    //     (e) => {
    //         if (e) e.preventDefault();
    //         if (!socket || !sessionRef.current || !text.trim()) return;

    //         socket.emit('message:send', {
    //             sessionId: sessionRef.current,
    //             senderType: 'visitor',
    //             message: text.trim()
    //         })

    //         setText('');
    //     }, [socket]
    // );

    // ------ control chat open/close
    const setChatOpen = (isOpen) => {
        isChatOpenRef.current = isOpen;

        if (isOpen) setUnread(0);
    };

    return {
        socket: socketRef.current,
        // exposed state
        sessionId,
        messages,
        isTyping,
        unread,
        adminOnline,

        // exposed actions
        sendMessage,
        sendTyping,
        startNewChat,
        setChatOpen,
    };
}