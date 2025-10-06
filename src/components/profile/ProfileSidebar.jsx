import React, { useState } from 'react';
import { sidebarItems } from './constants.jsx';

// Mobile Dropdown Component
const MobileDropdown = ({ activeTab, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="max-w-[250px] flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[#2563EB]">{sidebarItems.find(item => item.name === activeTab)?.icon}</span>
                    <span className="font-medium text-[#2563EB]">{activeTab}</span>
                </div>
                <svg
                    className={`ml-1 w-5 h-5 text-[#2563EB] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg w-full xs:w-1/2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                onSelect(item.name);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${item.name === activeTab ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-gray-700'
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

const ProfileSidebar = ({ isMobile = false, onClose = () => { }, active = "Overview", onSelect }) => (
    <div
        className={`fixed ${isMobile ? "top-0 w-64 h-full z-50" : "mt-[52px] w-64 h-full z-50"
            } left-0 bg-white shadow-md overflow-hidden flex flex-col`}
    >
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-2">
                {sidebarItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => {
                            onSelect(item.name);
                            if (isMobile) onClose();
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${item.name === active
                                ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <span className={item.name === active ? "text-[#2563EB]" : "text-gray-500"}>
                            {item.icon}
                        </span>
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default ProfileSidebar;
export { MobileDropdown };
