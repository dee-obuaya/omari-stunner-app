/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../../components/Loader';
import Chinwe from '../../assets/images/Chinwe.jpg'


export default function Home() {
    const [loadingHome, isLoadingHome] = useState(true);
    const [fetchingImages, setFetchingImages] = useState(false);
    const [image, setImage] = useState(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true
        let timerId;
        let imageLoader;
        if (isMounted.current) {

            timerId = setTimeout(() => {
                isLoadingHome(false);
                setFetchingImages(true);

                imageLoader = setTimeout(() => {
                    setImage(Chinwe);
                    setFetchingImages(false);
                }, 1500);
            }, 1000);

        };

        return () => {
            isMounted.current = false;
            clearTimeout(imageLoader);
            clearTimeout(timerId);
        };
    }, []);

    return (
        loadingHome ? (
            <Loader size='xl' tip="Just a moment..."/>
        ) : (
            <>
                <div className='my-8 space-y-10'>
                    <div className='space-y-5'>
                        <div className='flex justify-self-center justify-center items-center w-fit rounded-t-full p-5 outline-dashed inset-shadow-2sm inset-shadow-current dark:outline-neutral'>
                            <div className={`transition-all transition-discrete duration-500 ${(fetchingImages) ? 'skeleton w-3xs h-96 rounded-t-full ease-out' : ''}`}>
                                <img src={image} className={`w-3xs h-96 rounded-t-full shadow-2xl transition-all transition-discrete duration-500 ease-in ${(fetchingImages) ? 'opacity-0' : 'opacity-100'}`} alt='center-image' />
                            </div>
                        </div>

                        <div className='text-neutral-content text-center text-md tracking-widest mx-1.5'>
                            <p className='font-italiana w-max mx-auto'>Ready to stun?</p>
                            <p className='font-niconne w-max mx-auto'>The making of beauty is art, and we are the artists.</p>
                        </div>
                    </div>
                </div>
            </>
        )
    );
};