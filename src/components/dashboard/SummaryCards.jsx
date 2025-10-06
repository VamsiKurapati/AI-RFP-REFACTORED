import React from 'react';
import { getSummaryCardBgColor, getSummaryCardTextColor } from './constants';

const SummaryCards = ({ summaryData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summaryData.map((item, index) => (
                <div
                    key={index}
                    className="rounded-lg p-4 text-white"
                    style={{
                        background: getSummaryCardBgColor(item.label),
                        color: getSummaryCardTextColor(item.label)
                    }}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm opacity-80">{item.label}</p>
                            <p className="text-2xl font-bold">{item.count}</p>
                        </div>
                        <div className="text-3xl opacity-60">
                            {item.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
