import React, { useState } from 'react';
import { MdOutlineSearch, MdOutlineFilterList, MdOutlineClear } from 'react-icons/md';

const ProposalsFilter = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    typeFilter,
    onTypeFilterChange,
    onClearFilters
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'saved', label: 'Saved' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'rejected', label: 'Rejected' }
    ];

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'rfp', label: 'RFP' },
        { value: 'grant', label: 'Grant' },
        { value: 'proposal', label: 'Proposal' }
    ];

    const hasActiveFilters = searchTerm || statusFilter || typeFilter;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                    <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search proposals..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters || hasActiveFilters
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <MdOutlineFilterList className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {[searchTerm, statusFilter, typeFilter].filter(Boolean).length}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Clear all filters"
                    >
                        <MdOutlineClear className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => onTypeFilterChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Search: "{searchTerm}"
                            <button
                                onClick={() => onSearchChange('')}
                                className="ml-1 hover:text-blue-600"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {statusFilter && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                            <button
                                onClick={() => onStatusFilterChange('')}
                                className="ml-1 hover:text-green-600"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {typeFilter && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            Type: {typeOptions.find(opt => opt.value === typeFilter)?.label}
                            <button
                                onClick={() => onTypeFilterChange('')}
                                className="ml-1 hover:text-purple-600"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProposalsFilter;
