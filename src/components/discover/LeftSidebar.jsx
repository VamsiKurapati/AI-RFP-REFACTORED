import React from 'react';
import { MdOutlineClose } from "react-icons/md";

const LeftSidebar = ({ isOpen, onClose, filters, setFilters }) => {
    const categories = {
        category: ["Combined Synopsis/Solicitation", "Solicitation", "Presolicitation", "Sources Sought", "Special Notice", "Consolidate/(Substantially) Bundle"],
        deadline: ["Next 7 Days", "Next 30 Days", "Next 60 Days", "Next 90 Days", "Next 180 Days", "Not Disclosed"],
    };

    const handleChange = (type, value) => {
        setFilters((prev) => {
            const updated = { ...prev };
            updated[type] = prev[type]?.includes(value)
                ? prev[type].filter((v) => v !== value)
                : [...(prev[type] || []), value];
            return updated;
        });
    };

    const content = (
        <div className="p-4 w-64 bg-white h-full overflow-y-auto border-r">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[22px] font-semibold text-[#000000]">Filters</h3>
                <button
                    onClick={onClose}
                    className="hover:cursor-pointer"
                    aria-label="Close filters"
                    title="Close filters"
                >
                    <MdOutlineClose className="w-6 h-6 text-[#4B5563] hover:text-[#111827] shrink-0" />
                </button>
            </div>

            {Object.entries(categories).map(([category, values]) => (
                <div key={category} className="mb-4">
                    <h3 className="text-[16px] font-medium text-[#111827] capitalize mb-2">
                        {category.replace(/([A-Z])/g, " $1")}
                    </h3>
                    {values.map((value) => (
                        <div key={value} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                                checked={filters[category]?.includes(value) || false}
                                onChange={() => handleChange(category, value)}
                            />
                            <label className="text-[16px] text-[#6B7280]">{value}</label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
            {isOpen && content}
        </div>
    );
};

export default LeftSidebar;
