/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import useChatSocket from '../../hooks/useChatSocket';
import ChatBox from './ChatBox';

export default function ChatWidget() {
    const {
        sessionId,
        messages,
        unread,
        isTyping,
        adminOnline,
        sendMessage,
        sendTyping,
        setChatOpen,
        retryMessage,
    } = useChatSocket();

    const [isOpen, setIsOpen] = useState(false);
    // click handler
    const toggleChat = async () => {
        const nowOpen = !isOpen;

        setIsOpen(nowOpen);
        setChatOpen(nowOpen);
    };

    useEffect(() => {
        const audio = new Audio('/audio/chat_notification.mp3');
        // "Unlock" the audio on first gesture
        const unlock = () => {
            audio.play().catch(() => {});
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('click', unlock);
    }, []);


    return (
        <>
            {/* floating chat button */}
            <div className='fab'>
                {!isOpen && (
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

                        {unread > 0 && sessionId && (
                            <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1'>
                                {unread}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* chat window */}
            {isOpen && (
                <ChatBox
                    sessionId={sessionId}
                    messages={messages}
                    isTyping={isTyping}
                    onSend={sendMessage}
                    onTyping={sendTyping}
                    onClose={toggleChat}
                    adminOnline={adminOnline}
                    retryMessage={retryMessage}
                />
            )}
        </>
    )
};