import React from 'react';
import { statusStyles } from './constants';

const StatusBadge = ({ status }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
