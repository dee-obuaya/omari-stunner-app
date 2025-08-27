/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useRouteLoaderData } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggler';
import NavTab from '../components/NavTab';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export default function MainApp(props) {
    const { tabToSet } = useRouteLoaderData('main-app-id');
    const [activeTab, setActiveTab] = useState(tabToSet);
    const [loading, isLoading] = useState(true);
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
        if (isMounted.current) {
            isLoading(false);
        };

        return () => {
            isMounted.current = false;
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
    loading ? (
        <Loader size='xl' />
    ) : (
            <div className='h-max'>
                {/* Header: name and navbar with tabs */}
                <div id='header' className='bg-base-100 pb-1 space-y-3.5 lg:space-y-4.5 sticky top-0 z-20'>
                    <ThemeToggle />
                    <p className='font-italiana uppercase text-2xl lg:text-3xl tracking-[.20em] w-max mx-auto'>Omari Stunner</p>
                    <NavTab activeTab={activeTab} onTabChange={handleTabChange}/>
                </div>

                {/* Content */}
                <div id='content' className=''>
                    {/* The Outlet component renders the child routes */}
                    <Outlet />
                </div>

                {/* Footer: copyright */}
                <div id='footer'>
                    <Footer />
                </div>
            </div>
        )
    );
};