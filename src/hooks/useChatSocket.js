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

    const SENT_TIMEOUT = 8000;

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

    useEffect(() => {
        const pending = JSON.parse(
            localStorage.getItem('pendingMessages') || '[]'
        );

        if (pending.length) {
            setMessages(prev => {
                const existingIds = new Set(prev.map(m => m.clientId));
                const restored = pending.filter(
                    m => !existingIds.has(m.clientId)
                );
                return [...restored, ...prev];
            });
        }
    }, []);


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

            // ------ session restoration/creation ------
            if (!sessionIdRef.current) {
                // restore/create session
                let existing = localStorage.getItem('chat_sessionId');

                if (existing) {
                    // console.log("🔄 Restoring visitor session:", existing);

                    sessionIdRef.current = existing;
                    setSessionId(existing);

                    socket.emit('user:join', {
                        sessionId: existing,
                        userAgent: navigator.userAgent
                    });
                } else {
                    // console.log("✨ Creating a new visitor session...");
                    const newId = await startNewChat();

                    socket.emit('user:join', {
                        sessionId: newId,
                        userAgent: navigator.userAgent
                    });
                }
            }

            // flush pending messages safely
            setMessages(prev => {
                prev.forEach(msg => {
                    if (
                        (msg.status === 'sent' || msg.status === 'failed' || msg.status === 'slow') &&
                        !msg.inFlight &&
                        msg.clientId
                    ) {
                        emitMessage(msg);
                    }
                });

                return prev;
            });
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

        // console.log('Loading history for: ', sessionId);

        // load message history after session is confirmed
        fetch(
            `${API_BASE_URL}/api/chats/visitor/${sessionId}/messages`,
            { credentials: 'include' }
        )
            .then(res => res.json())
            .then(data => {
                // console.log('History loaded: ', data.messages);
                // setMessages(data.messages || []);

                setMessages(prev => {
                    const serverMessages = data.messages || [];

                    const pending = prev.filter(
                        m =>
                            m.status === 'sent' ||
                            m.status === 'failed' ||
                            m.status === 'slow'
                    );

                    const serverClientIds = new Set(
                        serverMessages.map(m => m.clientId).filter(Boolean)
                    );

                    const stillPending = pending.filter(
                        m => !serverClientIds.has(m.clientId)
                    );

                    return [...serverMessages, ...stillPending];
                });
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

            // console.log("📩 Received new message:", msg);

            setMessages(prev => {
                // reconciliation path
                if (msg.clientId) {
                    const index = prev.findIndex(
                        m => m.clientId && m.clientId === msg.clientId
                    );

                    if (index !== -1) {
                        const updated = [...prev];
                        // updated[index] = msg;
                        updated[index] = {
                            ...msg,
                            inFlight: false, // delivery confirmed
                            createdAt: prev[index].createdAt // preserve local timestamp
                        };

                        const pending = JSON.parse(localStorage.getItem('pendingMessages') || '[]');

                        localStorage.setItem(
                            'pendingMessages',
                            JSON.stringify(
                                pending.filter(m => m.clientId !== msg.clientId)
                            )
                        );

                        return updated;
                    }
                }
                // const updated = [...prev, msg];
                return [...prev, msg];
            });

            // unread
            if (!isChatOpenRef.current) {
                setUnread(u =>  u + 1);

                if (msg.senderType !== 'visitor' && unread > 0) {
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
        const handleStatus = ({ sessionId: sid, messageIds = [], status }) => {
            if (sid !== sessionIdRef.current) return;

            // console.log("📥 Visitor received message:status event:", { sid, messageIds, status });


            setMessages(prev =>
                prev.map(m =>
                    m.senderType === 'visitor' && messageIds.includes(m._id.toString())
                        ? {...m, status}
                        : m
                )
            );
        };

        // --- admin status ---

        const handleAdminStatus = ({ online }) => {
            // console.log('👨‍🦱 Admin online status changed: ', online);
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


    useEffect(() => {
        const timer = setInterval(() => {
            setMessages(prev =>
                prev.map(m => {
                    if (
                        m.status === 'sent' &&
                        Date.now() - new Date(m.createdAt).getTime() > SENT_TIMEOUT
                    ) {
                    return { ...m, status: 'failed' };
                    }
                    return m;
                })
            );
        }, 2000); // lightweight polling

        return () => clearInterval(timer);
    }, []);

    // ------ send message ------
    const sendMessage = (txt) => {
        if (!txt.trim() || !sessionIdRef.current) return;

        const clientId = crypto.randomUUID();

        // optimistic message first (ui-first)
        const optimisticMsg = {
            _id: `local-${clientId}`, // temporary id
            clientId,
            sessionId: sessionIdRef.current,
            senderType: 'visitor',
            message: txt.trim(),
            status: 'sent',
            // inFlight: true,
            inFlight: false, // will be set to true when actually sending
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, optimisticMsg]);

        const pending = JSON.parse(localStorage.getItem('pendingMessages') || '[]');

        localStorage.setItem(
            'pendingMessages',
            JSON.stringify([...pending, optimisticMsg])
        );

        // emit to server
        emitMessage(optimisticMsg);
    };

    // ------ send typing indicator ------
    const sendTyping = () => {
        if (!sessionIdRef.current) return;

        socketRef.current?.emit('typing', {
            sessionId: sessionIdRef.current,
            senderType: 'visitor',
        });
    };

    // ------ control chat open/close
    const setChatOpen = (isOpen) => {
        isChatOpenRef.current = isOpen;

        if (isOpen) setUnread(0);
    };

    // retry failed messages logic
    const retryMessage = (msg) => {
        if (!socketRef.current || !sessionIdRef.current) return;
        if (msg.inFlight) return;

        // console.log("🔄 inside retryMessage:", msg);

        // reset UI state
        setMessages(prev =>
            prev.map(m =>
            m.clientId === msg.clientId
                ? { ...m, status: 'sent', inFlight: false, createdAt: new Date().toISOString() }
                : m
            )
        );

        emitMessage(msg);
    };

    const emitMessage = (msg) => {
        console.log("🚀 Emitting message: ", msg)
        if (!socketRef.current || !socketRef.current.connected) return;
        if (msg.inFlight) return; // 🔒 rule enforcement

        // mark as in-flight BEFORE emitting
        setMessages(prev =>
            prev.map(m =>
            m.clientId === msg.clientId
                ? { ...m, inFlight: true }
                : m
            )
        );

        socketRef.current.emit('message:send', {
            sessionId: msg.sessionId,
            senderType: msg.senderType,
            message: msg.message,
            clientId: msg.clientId,
        });
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
        retryMessage,
    };
}