/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useRouteLoaderData } from 'react-router-dom';
import { MotionConfig, motion } from 'motion/react';
import ThemeToggle from '../components/ThemeToggler';
import NavTab from '../components/NavTab';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export default function MainApp(props) {
    const { tabToSet } = useRouteLoaderData('main-app-id');
    const [activeTab, setActiveTab] = useState(tabToSet);
    const [loading, isLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const isMounted = useRef(false);
    const location = useLocation();

    useEffect(() => {
        // Determine active tab based on current path
        if (location.pathname.includes('/home')) {
          setActiveTab('home');
        } else if (location.pathname.includes('/gallery')) {
          setActiveTab('gallery');
        } else if (location.pathname.includes('/services')) {
          setActiveTab('services');
        } else if (location.pathname.includes('/contact')) {
            setActiveTab('contact');
        }

        isMounted.current = true;
        let timer;
        if (isMounted.current) {
            isLoading(false);
            timer = setTimeout(() => {
                setIsVisible(true);
            }, 750);
        };

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        const currentTab = document.querySelector(`.${activeTab}-tab`);
        currentTab?.classList?.remove('tab-active');
        const newCurrentTab = document.querySelector(`.${tab}-tab`);
        newCurrentTab?.classList?.add('tab-active');
        setActiveTab(tab);
    };

    // Main component that serves as the root for the application
    // It can include a header, footer, or any other common elements

    return (
        <MotionConfig transition={{ duration: 0.5, ease: 'easeInOut' }}>
            {loading ? (
                <Loader size='xl' />
            ) : (
                <motion.div
                    layout
                    className={ `flex flex-col min-h-screen transition-all ease-in duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Header: name and navbar with tabs */}
                    <div id='header' className='bg-base-100 pb-1 space-y-3.5 lg:space-y-4.5 sticky top-0 z-20'>
                        <ThemeToggle />
                        <p className='font-italiana uppercase text-2xl tracking-[.20em] w-full md:pl-8 mx-auto text-center md:text-start font-medium'>
                            <span className='font-niconne text-5xl font-extralight'>O</span>mari <span className='font-niconne text-5xl font-extralight'>S</span>tunner
                        </p>
                        {/* <p className='font-italiana uppercase text-2xl lg:text-4xl tracking-[.20em] w-full pl-8 mx-auto text-start'>
                            Omari Stunner
                        </p> */}
                        <NavTab activeTab={activeTab} onTabChange={handleTabChange}/>
                    </div>

                    {/* Content */}
                    <motion.div layout id='content' className='grow overflow-y-auto mb-8'>
                        {/* The Outlet component renders the child routes */}
                        <Outlet />
                    </motion.div>

                    {/* Footer: copyright */}
                    <div id='footer' className='w-full bg-base-100'>
                        <Footer />
                    </div>
                </motion.div>
            )}
        </MotionConfig>
    );
};