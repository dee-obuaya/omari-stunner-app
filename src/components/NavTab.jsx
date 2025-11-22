/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants/ServerUrl';

export default function NavTab(props) {
    const {activeTab, onTabChange} = props;
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        getTabs();
    }, []);

    const getTabs = async() => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tabs`, {credentials: 'include'});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch tabs');
            } else {
                setTabs(data.tabs);
            }
            // create a check for if data is empty or returns an error
        } catch (e) {
            console.error('Error fetching tabs:', e);
        };
    };

    return (
        <>
            {tabs && (
                <div role='tablist' className='tabs tabs-lift tabs-sm md:tabs-lg lg:tabs-xl justify-center md:w-full font-italiana tracking-widest'>
                    {tabs.map((tab, e) => (
                        tab.active &&
                        <Link
                            to={'/' + tab.name}
                            key={tab.name}
                            role='tab'
                            className={`tab${(tab.name === activeTab) ? ' tab-active relative' : ''} ${tab.name}-tab`}
                            onClick={() => onTabChange(tab.name)}
                        >
                            {tab.label}

                            {(tab.name === activeTab) && (
                                <motion.div
                                    layoutId='tabHighlight'
                                    className='absolute inset-0 bg-primary/0 rounded-lg -z-10'
                                />
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}