import React from 'react';
import { MdOutlineBookmark, MdOutlineBookmarkBorder, MdOutlineShare, MdOutlineCalendarMonth } from 'react-icons/md';

const ProposalCard = ({
    proposal_info,
    onBookmark,
    onShare,
    onGenerate,
    onComplianceCheck,
    userRole,
    buttonText = "Generate",
    isCurrentEditor = true,
    isLoading = false,
    isFetching = false
}) => {
    const formatDate = (date) => {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return "Not Provided";
        }
        return dateObj.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between relative">
            <div>
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-[18px] mb-1 text-[#111827] line-clamp-2">
                        {proposal_info.title}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            title={proposal_info.bookmarked ? (userRole === "Viewer" ? "Viewer cannot unsave" : "Unsave") : "Save"}
                            onClick={proposal_info.bookmarked && userRole === "Viewer" ? undefined : onBookmark}
                            disabled={isLoading || (proposal_info.bookmarked && userRole === "Viewer")}
                            aria-label={proposal_info.bookmarked ? (userRole === "Viewer" ? "Viewer cannot unsave" : "Unsave proposal") : "Save proposal"}
                            className={`${buttonText === "Download" ? "hidden opacity-0 pointer-events-none" :
                                    proposal_info.bookmarked && userRole === "Viewer" ? "cursor-not-allowed opacity-50" :
                                        isLoading ? "cursor-wait opacity-75" : "cursor-pointer"
                                } text-[#111827]`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#111827]" aria-hidden="true"></div>
                            ) : proposal_info.bookmarked ? (
                                <MdOutlineBookmark className="w-5 h-5 shrink-0" />
                            ) : (
                                <MdOutlineBookmarkBorder className="w-5 h-5 shrink-0" />
                            )}
                        </button>

                        <button
                            title="Share"
                            onClick={onShare}
                            disabled={isLoading}
                            aria-label="Share proposal"
                            className={`${isLoading ? "cursor-wait opacity-75" : "cursor-pointer"} text-[#111827]`}
                        >
                            <MdOutlineShare className="w-5 h-5 shrink-0" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdOutlineCalendarMonth className="w-4 h-4" />
                        <span>Deadline: {formatDate(proposal_info.deadline)}</span>
                    </div>

                    {proposal_info.budget && (
                        <div className="text-sm text-gray-600">
                            Budget: ${proposal_info.budget.toLocaleString()}
                        </div>
                    )}

                    {proposal_info.organization && (
                        <div className="text-sm text-gray-600">
                            Organization: {proposal_info.organization}
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {proposal_info.description || "No description available."}
                </p>

                {proposal_info.tags && proposal_info.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {proposal_info.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                            </span>
                        ))}
                        {proposal_info.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{proposal_info.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || isFetching || !isCurrentEditor}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isLoading || isFetching || !isCurrentEditor
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    {isLoading || isFetching ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            {isLoading ? "Processing..." : "Loading..."}
                        </div>
                    ) : (
                        buttonText
                    )}
                </button>

                {buttonText !== "Download" && (
                    <button
                        onClick={onComplianceCheck}
                        disabled={isLoading || isFetching || !isCurrentEditor}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLoading || isFetching || !isCurrentEditor
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        Compliance
                    </button>
                )}
            </div>

            {!isCurrentEditor && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Read Only
                </div>
            )}
        </div>
    );
};

export default ProposalCard;
