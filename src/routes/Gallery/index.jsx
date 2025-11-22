/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import { transformationStringFromObject } from '@cloudinary/url-gen';
import Loader from '../../components/Loader';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../../constants/ServerUrl';
import cld from '../../utils/cloudinary';
import { i } from 'motion/react-client';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { crop } from '@cloudinary/url-gen/actions/resize';



export default function Gallery() {
    const [isVisible, setVisible] = useState(false);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const isMounted = useRef(false);
    const [gallery, setGallery] = useState({
        bridal: [],
        studio: [],
        photoshoot: [],
        others: []
    });

    const transformation = transformationStringFromObject([
        { width: 300, height: 400, crop: 'fill', quality: 100, format: 'png' },
        // if changing quality to 'auto', change format to 'auto' as well
    ])

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

    // useEffect(() => {
    //     console.log('Images updated:', gallery);
    // }, [gallery]);

    const getImages = async () => {
        setLoadingGallery(true);
        // Fetch or load images here
        try {
            const res = await fetch(`${API_BASE_URL}/api/images`, {credentials: 'include'});

            const data = await res.json();
            // console.log(data);

            if (res.ok) {

                const transformedImages = data.images.map(img => {
                    const imageToTransform = cld.image(img.image.filename);

                    const transformedImgUrl = imageToTransform.addTransformation(transformation).toURL();

                    img.image.url = transformedImgUrl;
                    return img;
                });

                setGallery({
                    bridal: transformedImages.filter(img => img.service?.service?.trim().toLowerCase() === 'bridal'),
                    studio: transformedImages.filter(img => img.service?.service?.trim().toLowerCase() === 'studio walk-in'),
                    photoshoot: transformedImages.filter(img => img.service?.service?.trim().toLowerCase() === 'photoshoot'),
                    others: transformedImages.filter(img => !['bridal', 'photoshoot', 'studio walk-in'].includes(img?.service?.service?.toLowerCase()))
                });
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
                <details className='collapse bg-base-100 border border-base-300' name='my-accordion-det-1' open>
                    <summary className='collapse-title font-niconne text-xl tracking-widest font-extralight'>Bridal</summary>
                    <div className='collapse-content text-sm'>
                        {gallery?.bridal?.length > 0 ? (
                            <motion.div
                                className='carousel carousel-center bg-neutral w-max h-64 md:h-96 space-x-4 p-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                {gallery.bridal.map((img, index) => (
                                        <motion.div
                                            className='carousel-item' key={index}
                                            initial={{ opacity: 0,  scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <img
                                            src={img.image.url}
                                            className='rounded-box' />
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
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
                    </div>
                </details>

                <details className='collapse bg-base-100 border border-base-300' name='my-accordion-det-1'>
                    <summary className='collapse-title font-niconne text-xl tracking-widest font-extralight'>Studio</summary>
                    <div className='collapse-content text-sm'>
                        {gallery?.studio?.length > 0 ? (
                            <motion.div
                                className='carousel carousel-center bg-neutral w-max h-64 md:h-96 space-x-4 p-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >

                                {gallery.studio.map((img, index) => (
                                        <motion.div
                                            className='carousel-item' key={index}
                                            initial={{ opacity: 0,  scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <img
                                            src={img.image.url}
                                            className='rounded-box' />
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
                        ): (
                            <motion.p
                                className='text-sm font-italiana tracking-widest font-extralight italic'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                No studio walk-in content
                            </motion.p>
                            )
                        }
                    </div>
                </details>

                <details className='collapse bg-base-100 border border-base-300' name='my-accordion-det-1'>
                    <summary className='collapse-title font-niconne text-xl tracking-widest font-extralight'>Photoshoot</summary>
                    <div className='collapse-content text-sm'>
                        {gallery?.photoshoot?.length > 0 ? (
                            <motion.div
                                className='carousel carousel-center bg-neutral w-max h-64 md:h-96 space-x-4 p-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                {gallery.photoshoot.map((img, index) => (
                                        <motion.div
                                            className='carousel-item' key={index}
                                            initial={{ opacity: 0,  scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <img
                                            src={img.image.url}
                                            className='rounded-box' />
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
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
                    </div>
                </details>

                <details className='collapse bg-base-100 border border-base-300' name='my-accordion-det-1'>
                    <summary className='collapse-title font-niconne text-xl tracking-widest font-extralight'>Others</summary>
                    <div className='collapse-content text-sm'>
                        {gallery?.others?.length > 0 ? (
                            <motion.div
                                className='carousel carousel-center bg-neutral w-max h-64 md:h-96 space-x-4 p-4'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >

                                {gallery.others.map((img, index) => (
                                        <motion.div
                                            className='carousel-item' key={index}
                                            initial={{ opacity: 0,  scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1 }}
                                        >
                                            <img
                                            src={img.image.url}
                                            className='rounded-box' />
                                        </motion.div>
                                    ))
                                }

                            </motion.div>
                        ): (
                            <motion.p
                                className='text-sm font-italiana tracking-widest font-extralight italic text-center'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                    No other content
                            </motion.p>
                        )}
                    </div>
                </details>
            </div>
        )
    )
};