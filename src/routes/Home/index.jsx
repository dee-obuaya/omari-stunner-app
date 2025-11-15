/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Loader from '../../components/Loader';
import Chinwe from '../../../public/images/Chinwe.jpg';


export default function Home() {
    const [loadingHome, isLoadingHome] = useState(true);
    const [fetchingImages, setFetchingImages] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const [image, setImage] = useState(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true
        let timerId;
        let imageLoader;
        let timer;
        if (isMounted.current) {

            timerId = setTimeout(() => {
                isLoadingHome(false);
                setFetchingImages(true);

                timer = setTimeout(() => {
                    setVisible(true);

                    imageLoader = setTimeout(() => {
                        setImage(Chinwe);
                        setFetchingImages(false);
                    }, 750);
                }, 200);
            }, 1000);

        };

        return () => {
            isMounted.current = false;
            clearTimeout(imageLoader);
            clearTimeout(timerId);
            clearTimeout(timer);
        };
    }, []);

    return (
        loadingHome ? (
            <Loader size='xl' tip="Just a moment..."/>
        ) : (
            <>
                <div className={`h-full pt-5 flex justify-center items-center space-y-10 transition-all ease-in duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className='space-y-5'>
                        <div className='flex justify-self-center justify-center items-center w-fit rounded-t-full p-5 outline-dashed inset-shadow-2sm inset-shadow-current dark:outline-neutral'>
                            <div className={`transition-all transition-discrete duration-500 ${(fetchingImages) ? 'skeleton w-3xs h-96 rounded-t-full ease-out' : ''}`}>
                                <motion.img
                                    src={image}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className={`w-3xs h-96 rounded-t-full shadow-2xl transition-all transition-discrete duration-500 ease-in ${(fetchingImages) ? 'opacity-0' : 'opacity-100'}`}
                                    alt='center-image'
                                />
                            </div>
                        </div>

                        <div className='grow text-neutral-content text-center text-md tracking-widest mx-1.5'>
                            <p className='font-italiana w-max mx-auto'>Ready to stun?</p>
                            <p className='font-niconne w-max mx-auto'>The making of beauty is art, and we are the artists.</p>
                        </div>
                    </div>
                </div>
            </>
        )
    );
};