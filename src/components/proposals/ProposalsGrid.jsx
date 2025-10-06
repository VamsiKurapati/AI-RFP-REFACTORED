import React from 'react';
import ProposalCard from './ProposalCard';

const ProposalsGrid = ({
    proposals,
    onBookmark,
    onShare,
    onGenerate,
    onComplianceCheck,
    userRole,
    isLoading,
    isFetching
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!proposals || proposals.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals found</h3>
                <p className="text-gray-600 mb-6">
                    {proposals === null ? 'Loading proposals...' : 'No proposals match your current filters.'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal, index) => (
                <ProposalCard
                    key={proposal._id || proposal.id || index}
                    proposal_info={proposal}
                    onBookmark={() => onBookmark(proposal)}
                    onShare={() => onShare(proposal)}
                    onGenerate={() => onGenerate(proposal)}
                    onComplianceCheck={() => onComplianceCheck(proposal)}
                    userRole={userRole}
                    buttonText={proposal.status === 'draft' ? 'Continue' : 'Generate'}
                    isCurrentEditor={true}
                    isLoading={isLoading}
                    isFetching={isFetching}
                />
            ))}
        </div>
    );
};

export default ProposalsGrid;
