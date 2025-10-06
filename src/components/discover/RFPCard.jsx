import React from 'react';
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineShare, MdOutlineBookmark, MdOutlinePayments, MdOutlineCalendarMonth, MdOutlineAccountBalance } from "react-icons/md";
import PropTypes from "prop-types";

const RFPCard = ({ rfp, isSaved, handleGenerateProposal, handleSaveRFP, loadingSave }) => {
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
                    {rfp.title}
                </h3>
                <button
                    onClick={() => handleSaveRFP(rfp._id)}
                    disabled={loadingSave[rfp._id]}
                    className={`p-2 rounded-full transition-colors ${isSaved
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                    title={isSaved ? 'Remove from saved' : 'Save RFP'}
                >
                    {loadingSave[rfp._id] ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                    ) : (
                        <FaRegBookmark className="w-5 h-5" />
                    )}
                </button>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlineAccountBalance className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{rfp.agency || 'Not specified'}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlinePayments className="w-4 h-4 mr-2" />
                    <span>{formatAmount(rfp.estimatedValue)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <MdOutlineCalendarMonth className="w-4 h-4 mr-2" />
                    <span>Due: {formatDate(rfp.deadline)}</span>
                </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {rfp.description || 'No description available'}
            </p>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => window.open(rfp.url, '_blank')}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <MdOutlineShare className="w-4 h-4" />
                        View Details
                    </button>
                </div>

                <button
                    onClick={() => handleGenerateProposal(rfp)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Generate Proposal
                </button>
            </div>
        </div>
    );
};

RFPCard.propTypes = {
    rfp: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        agency: PropTypes.string,
        estimatedValue: PropTypes.string,
        deadline: PropTypes.string,
        url: PropTypes.string,
    }).isRequired,
    isSaved: PropTypes.bool.isRequired,
    handleGenerateProposal: PropTypes.func.isRequired,
    handleSaveRFP: PropTypes.func.isRequired,
    loadingSave: PropTypes.object.isRequired,
};

export default RFPCard;
