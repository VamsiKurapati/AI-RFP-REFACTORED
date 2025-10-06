import React from 'react';
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineShare, MdOutlineBookmark, MdOutlinePayments, MdOutlineCalendarMonth, MdOutlineAccountBalance } from "react-icons/md";
import PropTypes from "prop-types";

const GrantCard = ({ grant, isSaved, handleGenerateProposal, handleSaveGrant, loadingSave }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        if (!amount) return 'Not specified';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                    {grant.OPPORTUNITY_TITLE}
                </h3>
                <button
                    onClick={() => handleSaveGrant(grant._id)}
                    disabled={loadingSave[grant._id]}
                    className={`p-2 rounded-full transition-colors ${isSaved
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                    title={isSaved ? 'Remove from saved' : 'Save Grant'}
                >
                    {loadingSave[grant._id] ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                    ) : (
                        <FaRegBookmark className="w-5 h-5" />
                    )}
                </button>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlineAccountBalance className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{grant.AGENCY_NAME || 'Not specified'}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlinePayments className="w-4 h-4 mr-2" />
                    <span>{formatAmount(grant.AWARD_CEILING)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlineCalendarMonth className="w-4 h-4 mr-2" />
                    <span>Due: {formatDate(grant.ESTIMATED_APPLICATION_DUE_DATE)}</span>
                </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {grant.FUNDING_DESCRIPTION || 'No description available'}
            </p>

            {grant.matchScore && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Match Score:</span>
                        <span className="font-medium text-green-600">{grant.matchScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${grant.matchScore}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => window.open(grant.OPPORTUNITY_NUMBER_LINK, '_blank')}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <MdOutlineShare className="w-4 h-4" />
                        View Details
                    </button>
                </div>

                <button
                    onClick={() => handleGenerateProposal(grant)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Generate Proposal
                </button>
            </div>
        </div>
    );
};

GrantCard.propTypes = {
    grant: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        OPPORTUNITY_TITLE: PropTypes.string.isRequired,
        FUNDING_DESCRIPTION: PropTypes.string.isRequired,
        AWARD_CEILING: PropTypes.string,
        ESTIMATED_APPLICATION_DUE_DATE: PropTypes.string,
        AGENCY_NAME: PropTypes.string,
        CATEGORY_OF_FUNDING_ACTIVITY: PropTypes.string,
        OPPORTUNITY_NUMBER_LINK: PropTypes.string,
        matchScore: PropTypes.number,
    }).isRequired,
    isSaved: PropTypes.bool.isRequired,
    handleGenerateProposal: PropTypes.func.isRequired,
    handleSaveGrant: PropTypes.func.isRequired,
    loadingSave: PropTypes.object.isRequired,
};

export default GrantCard;
