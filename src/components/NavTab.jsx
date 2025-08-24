/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

export default function NavTab(props) {
    const {activeTab, onTabChange} = props;
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        getTabs();
    }, []);

    const getTabs = async() => {
        try {
            const response = await fetch('http://localhost:5000/api/tabs');
            const data = await response.json();
            setTabs(data);
        } catch (e) {
            console.error('Error fetching tabs:', e);
        };
    };

    return (
        <>
            <div role="tablist" className="tabs tabs-lift tabs-sm md:tabs-lg lg:tabs-xl justify-center md:w-full font-italiana tracking-widest">
                {/* <span class="grow border-b border-base-300"></span> */}
                {tabs.map((tab, e) => (
                    <Link
                        to={'/' + tab.name}
                        key={tab.name}
                        role="tab"
                        className={`tab${(tab.name === activeTab) ? ' tab-active' : ''} ${tab.name}-tab`}
                        onClick={() => onTabChange(tab.name)}
                    >
                        {tab.label}
                    </Link>
                ))}
                {/* <span class="grow border-b border-base-300"></span> */}
            </div>
        </>
    );
}