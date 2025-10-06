import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineExpandMore, MdOutlineCheck, MdOutlineClose } from "react-icons/md";

const IndustryMultiSelect = ({ selectedIndustries, onIndustryChange, industries }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleIndustry = (industry) => {
        if (selectedIndustries.includes(industry)) {
            onIndustryChange(selectedIndustries.filter(i => i !== industry));
        } else {
            onIndustryChange([...selectedIndustries, industry]);
        }
    };

    const handleRemoveIndustry = (industry) => {
        onIndustryChange(selectedIndustries.filter(i => i !== industry));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedIndustries.map((industry) => (
                    <span
                        key={industry}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                        {industry}
                        <button
                            onClick={() => handleRemoveIndustry(industry)}
                            className="hover:text-blue-600"
                        >
                            <MdOutlineClose className="w-4 h-4" />
                        </button>
                    </span>
                ))}
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Select Industries</span>
                    <MdOutlineExpandMore className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {industries.map((industry) => (
                        <div
                            key={industry}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleToggleIndustry(industry)}
                        >
                            <div className="flex items-center">
                                {selectedIndustries.includes(industry) && (
                                    <MdOutlineCheck className="w-4 h-4 text-blue-600 mr-2" />
                                )}
                                <span className="text-gray-700">{industry}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndustryMultiSelect;
