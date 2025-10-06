import React from 'react';
import { badgeStyles } from './constants.jsx';

const StatusBadge = ({ status, className = "" }) => {
    return (
        <span className={`px-2 py-1 text-[12px] rounded-full text-center ${badgeStyles[status] || "bg-[#E5E7EB] text-gray-700"} ${className}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
