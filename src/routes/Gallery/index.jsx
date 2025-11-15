/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import Loader from '../../components/Loader';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../../constants/ServerUrl';
import { img } from 'motion/react-client';



export default function Gallery() {
    const [isVisible, setVisible] = useState(false);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [images, setImages] = useState([]);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        let timerId;
        let timer;

        if (isMounted.current) {
            timerId = setTimeout(() => {
                getImages();

                timer = setTimeout(() => {
                    setVisible(true);
                }, 500);
            }, 1000);
        };
        return () => {
            isMounted.current = false;
            clearTimeout(timer);
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        console.log('Images updated:', images);
    }, [images]);

    const getImages = async () => {
        setLoadingGallery(true);
        // Fetch or load images here
        try {
            const res = await fetch(`${API_BASE_URL}/api/images`, {credentials: 'include'});

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setImages(data.images);
            } else {
                console.error('Failed to fetch images');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoadingGallery(false);
        }
    };

    return (
        loadingGallery ? (
            <Loader size='xl' tip='Just a moment...' />
        ) :
        (
            <div className={`h-full p-5 md:px-10 lg:px-14 lg:py-10 flex flex-col justify-between items-center space-y-5 transition-all ease-in duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
                    <summary className="collapse-title font-semibold">Bridal</summary>
                    <div className="collapse-content text-sm">
                        <motion.div
                            className='carousel carousel-center bg-neutral lg:w-full h-64 md:h-96 space-x-4 p-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {images?.length > 0 ? (
                                images.map((img, index) => (
                                    img.service?.service?.trim().toLowerCase() === 'bridal' &&
                                    <div className='carousel-item' key={index}>
                                        <img
                                        src={img.image.url}
                                        className='rounded-box' />
                                    </div>
                                ))
                            ) : (
                                <motion.p
                                    className='text-sm font-italiana tracking-widest font-extralight italic'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                        No bridal content
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </details>
                <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
                    <summary className="collapse-title font-semibold">Studio</summary>
                    <div className="collapse-content text-sm">
                        <motion.div
                            className='carousel carousel-center bg-neutral lg:w-full h-64 md:h-96 space-x-4 p-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {images?.length > 0 ? (
                                images.map((img, index) => (
                                    img.service?.service?.toLowerCase() === 'studio walk-in' &&
                                    <div className='carousel-item' key={index}>
                                        <img
                                        src={img.image.url}
                                        className='rounded-box' />
                                    </div>
                                ))
                            ) : (
                                <motion.p
                                    className='text-sm font-italiana tracking-widest font-extralight italic'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                        No studio walk-in content
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </details>
                <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
                    <summary className="collapse-title font-semibold">Photoshoot</summary>
                    <div className="collapse-content text-sm">
                        <motion.div
                            className='carousel carousel-center bg-neutral lg:w-full h-64 md:h-96 space-x-4 p-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {images?.length > 0 ? (
                                images.map((img, index) => (
                                    img.service?.service?.trim().toLowerCase() === 'photoshoot' &&
                                    <div className='carousel-item' key={index}>
                                        <img
                                        src={img.image.url}
                                        className='rounded-box' />
                                    </div>
                                ))
                            ) : (
                                <motion.p
                                    className='text-sm font-italiana tracking-widest font-extralight italic'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                        No photoshoot content
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </details>
                <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
                    <summary className="collapse-title font-semibold">Others</summary>
                    <div className="collapse-content text-sm">
                        <motion.div
                            className='carousel carousel-center bg-neutral lg:w-full h-64 md:h-96 space-x-4 p-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {images?.length > 0 ? (
                                images.map((img, index) => (
                                    !['bridal', 'photoshoot', 'studio walk-in'].includes(img?.service?.service?.toLowerCase())  &&
                                    <div className='carousel-item' key={index}>
                                        <img
                                        src={img.image.url}
                                        className='rounded-box' />
                                    </div>
                                ))
                            ) : (
                                <motion.p
                                    className='text-sm font-italiana tracking-widest font-extralight italic'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                        No other content
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </details>
            </div>
        )
    )
};