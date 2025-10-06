import React from 'react';
import { MdOutlineClose } from "react-icons/md";

const GrantsFilterSidebar = ({ isOpen, onClose, grantFilters, setGrantFilters }) => {
    const fundingInstrumentTypes = ['Grant', 'Cooperative Agreement', 'Procurement Contract', 'Other'];
    const expectedNumberOfAwards = ['0-10', '10-25', '25-50', '50-100', '>100'];
    const awardCeiling = ['0-10000', '10000-50000', '50000-100000', '>100000'];
    const costSharingMatchRequirement = ['Yes', 'No'];
    const opportunityStatus = ['Posted', 'Forecasted'];
    const deadlineRange = ['7', '30', '60', '90', '180'];

    const handleChange = (type, value) => {
        setGrantFilters((prev) => {
            const updated = { ...prev };
            updated[type] = prev[type]?.includes(value)
                ? prev[type].filter((v) => v !== value)
                : [...(prev[type] || []), value];
            return updated;
        });
    };

    const resetFilters = () => {
        setGrantFilters({
            fundingInstrumentType: [],
            expectedNumberOfAwards: [],
            awardCeiling: [],
            costSharingMatchRequirement: [],
            opportunityStatus: [],
            deadlineRange: []
        });
    };

    const content = (
        <div className="p-4 w-64 bg-white h-full overflow-y-auto border-r">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[22px] font-semibold text-[#000000]">Grant Filters</h3>
                <button
                    onClick={onClose}
                    className="hover:cursor-pointer"
                    aria-label="Close filters"
                    title="Close filters"
                >
                    <MdOutlineClose className="w-6 h-6 text-[#4B5563] hover:text-[#111827] shrink-0" />
                </button>
            </div>

            <button
                onClick={resetFilters}
                className="mb-4 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
                Reset All Filters
            </button>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Funding Instrument Type</h3>
                {fundingInstrumentTypes.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.fundingInstrumentType?.includes(value) || false}
                            onChange={() => handleChange('fundingInstrumentType', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">{value}</label>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Expected Number of Awards</h3>
                {expectedNumberOfAwards.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.expectedNumberOfAwards?.includes(value) || false}
                            onChange={() => handleChange('expectedNumberOfAwards', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">{value}</label>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Award Ceiling</h3>
                {awardCeiling.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.awardCeiling?.includes(value) || false}
                            onChange={() => handleChange('awardCeiling', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">${value}</label>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Cost Sharing Required</h3>
                {costSharingMatchRequirement.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.costSharingMatchRequirement?.includes(value) || false}
                            onChange={() => handleChange('costSharingMatchRequirement', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">{value}</label>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Opportunity Status</h3>
                {opportunityStatus.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.opportunityStatus?.includes(value) || false}
                            onChange={() => handleChange('opportunityStatus', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">{value}</label>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">Deadline Range (Days)</h3>
                {deadlineRange.map((value) => (
                    <div key={value} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            className="mr-2 text-[#4B5563] mt-1 w-3 h-3"
                            checked={grantFilters.deadlineRange?.includes(value) || false}
                            onChange={() => handleChange('deadlineRange', value)}
                        />
                        <label className="text-[16px] text-[#6B7280]">{value} days</label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
            {isOpen && content}
        </div>
    );
};

export default GrantsFilterSidebar;
