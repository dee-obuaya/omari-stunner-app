/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
// import { API_BASE_URL } from '../../constants/ServerUrl';
import useChatSocket from '../../hooks/useChatSocket';

export default function ChatBox({
    sessionId,
    messages = [],
    isTyping,
    adminOnline,
    onSend,
    onTyping,
    onClose,
}) {
    const bottomRef = useRef(null);
    const [text, setText] = useState('');

    // auto-scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = e => {
        e.preventDefault();

        if (!text.trim()) return;

        onSend(text.trim());
        setText('');
    };

    const handleTyping = e => {
        const value = e.target.value;
        setText(value);
        onTyping();
    };

    function groupMessages(msgs) {
        const groups = [];
        let currentGroup = null;

        msgs.length > 0 && msgs.forEach((msg) => {
            const date = new Date(msg.createdAt).toDateString();

            const last = currentGroup?.messages.at(-1);
            // [currentGroup.messages.length - 1]

            const sameSender = last?.senderType === msg.senderType;
            const sameDay = currentGroup?.date === date;

            if (!sameSender || !sameDay) {
                currentGroup = {
                    senderType: msg.senderType,
                    date,
                    messages: []
                };
                groups.push(currentGroup);
            }

            currentGroup.messages.push(msg);
        });

        return groups;
    };

    const grouped = groupMessages(messages);


    return (
        <div className='fixed bottom-20 right-5 w-80 h-80 max-h-[70vh] bg-white shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col'>
            {/* Header */}
            <div className='bg-info/75 text-white p-3 flex justify-between items-center'>
                <span className='font-semibold text-info-content font-libertinus tracking-wider'>Chat with Us</span>

                {adminOnline ? (
                    <span className="text-green-500 text-xs font-semibold">
                        Online
                    </span>
                ) : (
                    <span className="text-gray-400 text-xs">
                        Offline
                    </span>
                )}

                <button className='text-info-content' onClick={onClose}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24' height='24' viewBox='0 0 24 24'
                        fill='none' stroke='currentColor'
                        strokeWidth='2' strokeLinecap='round'
                        strokeLinejoin='round' className='lucide lucide-x-icon lucide-x'
                    >
                        <path d='M18 6 6 18'/><path d='m6 6 12 12'/>
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-3 space-y-2 bg-neutral/40 dark:bg-base-300/85 h-full'>

                {grouped.map((group, i) => (
                    <div key={i}>
                        {/* date label */}
                        <div className='text-center text-xs text-gray-400 my-2'>
                            {group.date}
                        </div>

                        {group.messages.map((m) => (
                            <div
                                key={m._id}
                                className={`chat ${m.senderType === 'visitor' ? 'chat-end' : 'chat-start'}`}
                            >
                                <div className='chat-bubble'>
                                    {m.message}
                                </div>
                                    <div className='chat-footer opacity-50'>
                                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {m.senderType === 'visitor' &&
                                            <span className='ml-2 text-warning'>
                                                {m.status == 'sent' && 'Sent'}
                                                {m.status == 'delivered' && 'Delivered'}
                                                {m.status == 'seen' && 'Seen'}
                                            </span>
                                        }
                                    </div>
                            </div>
                        ))}
                    </div>
                ))}


                {isTyping && (
                    <div className='italic text-sm text-gray-500 px-2'>
                        Admin is typing...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className='p-1.5 border-t flex gap-2'>
                <input
                    className='input flex-1 border rounded-md px-3 py-2 text-sm'
                    placeholder='Type a message...'
                    value={text}
                    onChange={handleTyping}
                />

                <button
                    type='submit'
                    className='bg-info text-white px-3 rounded-md'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24' height='24' viewBox='0 0 24 24'
                        fill='none' stroke='currentColor'
                        strokeWidth='2' strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-arrow-up-icon lucide-arrow-up'
                    >
                        <path d='m5 12 7-7 7 7'/><path d='M12 19V5'/>
                    </svg>
                </button>
            </form>
        </div>
    );
};