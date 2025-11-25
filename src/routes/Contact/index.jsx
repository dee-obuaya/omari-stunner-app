/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../../constants/ServerUrl';
import {
	FaFacebookF,
	FaInstagram,
	FaP,
	FaPhone,
	FaTiktok,
	FaWhatsapp,
} from 'react-icons/fa6';
import Loader from '../../components/Loader';

const socials = [
	{
		id: 'phone',
		icon: FaPhone,
		label: 'Call us',
		handle: '+234 903 918 9330',
	},
	{
		id: 'whatsapp',
		icon: FaWhatsapp,
		label: 'WhatsApp',
		handle: 'Omari Stunner',
	},
	{
		id: 'instagram',
		icon: FaInstagram,
		label: 'Instagram',
		handle: '@omaristunner',
	},
	{
		id: 'facebook',
		icon: FaFacebookF,
		label: 'Facebook',
		handle: 'Omari Stunner',
	},
	{
		id: 'tiktok',
		icon: FaTiktok,
		label: 'TikTok',
		handle: '@omathestunner',
	},
];

export default function Contact() {
	const [isVisible, setVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hoveredSocial, setHoveredSocial] = useState(null);
	const [messageInfo, setMessageInfo] = useState({
		name: '',
		email: '',
		phone: '',
		body: '',
	});

	useEffect(() => {
		let timer;
		let visibilityTimer;

		timer = setTimeout(() => {
			setLoading(false);

			visibilityTimer = setTimeout(() => {
				setVisible(true);
			}, 300);
		}, 1000);

		return () => {
			clearTimeout(timer);
			clearTimeout(visibilityTimer);
		};
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'message[name]')
			setMessageInfo({ ...messageInfo, name: value });
		if (name === 'message[email]')
			setMessageInfo({ ...messageInfo, email: value });
		if (name === 'message[phone]')
			setMessageInfo({ ...messageInfo, phone: value });
		if (name === 'message[body]')
			setMessageInfo({ ...messageInfo, body: value });
	};

	const handleSubmit = async (e, data) => {
		e.preventDefault();

		// Submit messageInfo to the server or handle it as needed
		console.log('Submitting message:', messageInfo);

        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageInfo }),
                credentials: 'include',
            });

            const responseData = await res.json();

            if (!res.ok) {
                console.log('Failed to submit message:', responseData);
                // show alert or notification to user
                return;
            }

            if (responseData.data) {
                console.log('Message submitted successfully:', responseData.data);
                // show success alert or notification to user
            } else {
                console.log('Unexpected response:', responseData);
                // show alert or notification to user
            }
        } catch (error) {
            console.error('Error submitting message:', error);
            // show alert or notification to user
        }
	};

	if (loading) {
		return <Loader size='xl' tip='Just a moment...' />;
	}

	return (
		<motion.div
			className={`h-full md:h-180 lg:h-full pt-8 flex justify-center items-center space-y-10 transition-all ease-in duration-700 overflow-x-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
			<motion.div
                className='hero'
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
				<div className='hero-content flex-col lg:flex-row-reverse gap-10'>
					<motion.div
                        className='text-center lg:text-left max-w-2xl'
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                    >
						<h1 className='text-4xl lg:text-5xl font-light font-niconne tracking-widest lg:pl-10'>
							Get in touch with us!
						</h1>
						<div className='py-4'>
							<p className='mb-4 font-libertinus font-extralight tracking-wider lg:pl-10'>
								We would love to hear from you. Whether you have
								a question about our services, pricing, or
								anything else, our team is ready to answer all
								your questions.
							</p>

                            {/* Socials container */}
                            <div className='flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-6'>
                                {/* Icons list */}
                                <ul
                                    className='list-none space-x-5 lg:space-x-3 lg:space-y-0 flex lg:flex-row justify-center items-center'
                                >
                                    {socials.map((social, idx) => {
                                        const Icon = social.icon;
                                        return (
                                            <motion.li
                                                key={social.id}
                                                className='relative flex items-center justify-center'
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                                                onMouseEnter={() => setHoveredSocial(social.id)}
                                                onMouseLeave={() => setHoveredSocial(null)}
                                            >
                                                <motion.button
                                                    type='button'
                                                    className='p-3 rounded-full border border-base-300 shadow-sm
                                                               hover:shadow-md hover:border-base-100 focus:outline-none
                                                               flex items-center justify-center transition-all'
                                                    whileHover={{ scale: 1.1, y: -3 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                                                >
                                                    <Icon className='text-xl hover:text-pink-700/60' />
                                                </motion.button>

                                                {/* Tooltip label for large screens only */}
                                                <motion.div
                                                    className='hidden lg:block absolute top-full mt-2 px-3 py-1 rounded-full
                                                               bg-base-200 text-xs font-light tracking-wide whitespace-nowrap'
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={
                                                        hoveredSocial === social.id
                                                            ? { opacity: 1, y: 0 }
                                                            : { opacity: 0, y: 6 }
                                                    }
                                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                                >
                                                    {social.handle}
                                                </motion.div>
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </div>
						</div>
					</motion.div>

                    {/* Form card */}
					<motion.div
                        className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                    >
						<div className='card-body'>
							<fieldset className='fieldset'>
                                <label className='label'>Name</label>
                                <input
                                    type='text'
                                    className='input'
                                    placeholder='Name'
                                    name='message[name]'
                                    onChange={handleChange}
                                />

								<label className='label'>Email</label>
								<input
									type='email'
									className='input validator'
									placeholder='name@gamil.com'
                                    name='message[email]'
                                    onChange={handleChange}
                                    required
								/>
                                <div className='validator-hint hidden'>Enter a valid email address</div>

								<label className='label'>Phone</label>
								<input
									type='text'
									className='input'
									placeholder='Phone number'
                                    name='message[phone]'
                                    onChange={handleChange}
								/>

                                <label className='label'>Message</label>
                                <textarea
                                    className='textarea h-24'
                                    placeholder='Your message...'
                                    name='message[body]'
                                    onChange={handleChange}
                                ></textarea>

								<motion.button
                                    className='btn btn-neutral text-neutral-content mt-4 font-italiana tracking-widest font-light'
                                    type='submit'
                                    onClick={handleSubmit}
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                                >
									Send Message
								</motion.button>
							</fieldset>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
}
