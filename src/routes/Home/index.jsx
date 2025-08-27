import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Chinwe from '../../assets/images/Chinwe.jpg';
import BigHead from '../../assets/images/BigHead.jpg';
import KoyinBridal from '../../assets/images/Koyin-Bridal.jpg';
import StephTradBridal from '../../assets/images/Steph-TradBridal.jpg'

export default function Home() {
    const [loadingHome, isLoadingHome] = useState(true);
    const isMounted = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        isMounted.current = true
        let timerId;
        if (isMounted.current) {
            timerId = setTimeout(() => {
                isLoadingHome(false);
            }, 3000);
        };

        return () => {
            isMounted.current = false;
            clearTimeout(timerId);
        };
    }, []);

    const handleRedirect = () => {
        navigate('/gallery');
    };

    return (
        loadingHome ? (
            <Loader size='xl' />
        ) : (
            <>
                <div className='my-8 space-y-10'>
                    <div className='flex justify-self-center justify-center items-center w-fit rounded-t-full p-5 outline-dashed inset-shadow-2sm inset-shadow-current dark:outline-neutral'>
                        <img src={Chinwe} className='w-3xs rounded-t-full shadow-2xl' alt='center-image' />
                    </div>

                    <div className='text-neutral-content text-center text-md tracking-widest mx-1.5'>
                        <p className='font-italiana w-max mx-auto'>Ready to stun?</p>
                        <p className='font-niconne w-max mx-auto'>The making of beauty is art, and we are the artists.</p>
                    </div>

                    <div className="relative">
                        <div className="carousel carousel-center bg-neutral space-x-4 p-4">
                            <div className="carousel-item">
                                <img
                                src={BigHead}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={KoyinBridal}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={StephTradBridal}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={Chinwe}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={BigHead}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={KoyinBridal}
                                className="rounded-box h-64" />
                            </div>
                            <div className="carousel-item">
                                <img
                                src={StephTradBridal}
                                className="rounded-box h-64" />
                            </div>

                            {/* <div className='absolute inset-0 flex items-center justify-center'>
                                <button className="btn btn-xl btn-base-200 text-neutral">Go to Gallery</button>
                            </div> */}
                        </div>

                        <div className='absolute left-28 md:left-80 lg:left-96 lg:ml-16 xl:left-1/2 xl:ml-0 bottom-24 w-max h-fit'>
                            <button
                                className="btn btn-xl btn-primary font-italiana tracking-[.18em] text-base"
                                onClick={handleRedirect}
                            >
                                Go to Gallery
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    );
};