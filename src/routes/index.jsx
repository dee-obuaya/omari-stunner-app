/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import ThemeToggle from '../components/ThemeToggler';
import NavTab from '../components/NavTab';
import Footer from '../components/Footer';

export default function MainApp(props) {
    const { defaultActive } = props;
    const [activeTab, setActiveTab] = useState(defaultActive);

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
    <div className='scrollbar-hidden h-screen'>
        {/* Header: name and navbar with tabs */}
        <div id='header' className='space-y-3.5 lg:space-y-4.5'>
            <ThemeToggle />
            <p className='font-italiana uppercase text-2xl lg:text-3xl tracking-[.20em] w-max mx-auto'>Omari Stunner</p>
            <NavTab activeTab={activeTab} onTabChange={handleTabChange}/>
        </div>

        {/* Content */}
        <div id='content'>
            {/* The Outlet component renders the child routes */}
            <Outlet />
        </div>

        {/* Footer: copyright */}
        <div id='footer'>
            <Footer />
        </div>
    </div>
  );
};