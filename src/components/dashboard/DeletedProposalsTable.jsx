import React from 'react';
import { MdOutlineRotateLeft, MdOutlineDeleteForever } from "react-icons/md";
import StatusBadge from './StatusBadge';
import { PAGE_SIZE } from './constants';

const DeletedProposalsTable = ({
    deletedProposals,
    currentDeletedPage,
    setCurrentDeletedPage,
    totalDeletedPages,
    restoringProposal,
    deletingPermanently,
    onRestoreProposal,
    onDeletePermanently,
    isGrantProposals = false
}) => {
    const paginatedDeletedProposals = deletedProposals.slice((currentDeletedPage - 1) * PAGE_SIZE, currentDeletedPage * PAGE_SIZE);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#111827]">
                    {isGrantProposals ? 'Deleted Grant Proposals' : 'Deleted Proposals'}
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">
                                {isGrantProposals ? 'Opportunity Title' : 'Title'}
                            </th>
                            <th className="text-left py-2">
                                {isGrantProposals ? 'Agency Name' : 'Client'}
                            </th>
                            <th className="text-left py-2">
                                {isGrantProposals ? 'Close Date' : 'Deadline'}
                            </th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Restore In</th>
                            <th className="text-left py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDeletedProposals.map((p, idx) => {
                            const absoluteIdx = (currentDeletedPage - 1) * PAGE_SIZE + idx;
                            return (
                                <tr key={absoluteIdx} className="border-t">
                                    <td className="px-4 py-2 font-semibold">
                                        {isGrantProposals ? (p.OPPORTUNITY_TITLE || 'Not Provided') : p.title}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isGrantProposals ? (p.AGENCY_NAME || 'Not Provided') : p.client}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isGrantProposals ? (
                                            p.CLOSE_DATE ? new Date(p.CLOSE_DATE).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : "No close date"
                                        ) : (
                                            new Date(p.deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <StatusBadge status={isGrantProposals ? (p.OPPORTUNITY_STATUS || p.status) : p.status} />
                                    </td>
                                    <td className="px-4 py-2">{p.restoreIn}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onRestoreProposal(absoluteIdx)}
                                                disabled={restoringProposal[absoluteIdx]}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {restoringProposal[absoluteIdx] ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <MdOutlineRotateLeft className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDeletePermanently(absoluteIdx)}
                                                disabled={deletingPermanently[absoluteIdx]}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deletingPermanently[absoluteIdx] ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <MdOutlineDeleteForever className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedDeletedProposals.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No {isGrantProposals ? 'deleted grant proposals' : 'deleted proposals'} found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 my-2 px-4">
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentDeletedPage(p => Math.max(1, p - 1))}
                    disabled={currentDeletedPage === 1 || paginatedDeletedProposals.length === 0}
                >
                    Prev
                </button>
                {Array.from({ length: totalDeletedPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-2 py-1 border rounded ${currentDeletedPage === i + 1 ? 'bg-[#2563EB] text-white' : ''}`}
                        onClick={() => setCurrentDeletedPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentDeletedPage(p => Math.min(totalDeletedPages, p + 1))}
                    disabled={currentDeletedPage === totalDeletedPages || paginatedDeletedProposals.length === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DeletedProposalsTable;
