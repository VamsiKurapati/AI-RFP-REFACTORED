import React from 'react';
import { MdOutlineEdit, MdOutlineSearch, MdOutlineRotateLeft, MdOutlineDeleteForever, MdPersonAddAlt1, MdOutlineClose } from "react-icons/md";
import StatusBadge from './StatusBadge';
import { PAGE_SIZE } from './constants';

const ProposalsTable = ({
    proposals,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedProposals,
    showDeleteOptions,
    editingProposal,
    deletingProposal,
    deletingPermanently,
    currentEditor,
    setCurrentEditor,
    onSelectProposal,
    onEditClick,
    onEditChange,
    onSaveProposal,
    onSetCurrentEditor,
    onDeleteProposals,
    onDeletePermanently,
    onRestoreProposal,
    role
}) => {
    const paginatedProposals = proposals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#111827]">Proposals</h2>
                <div className="flex gap-2">
                    {showDeleteOptions && (
                        <button
                            onClick={onDeleteProposals}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Delete Selected
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            {showDeleteOptions && <th className="text-left py-2">Select</th>}
                            <th className="text-left py-2">Title</th>
                            <th className="text-left py-2">Client</th>
                            <th className="text-left py-2">Deadline</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Current Editor</th>
                            <th className="text-left py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProposals.map((p, idx) => {
                            const realIdx = (currentPage - 1) * PAGE_SIZE + idx;
                            return (
                                <tr key={realIdx} className="border-t">
                                    {showDeleteOptions && (
                                        <td className="px-2 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedProposals.includes(realIdx)}
                                                onChange={() => onSelectProposal(realIdx)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-4 py-2">
                                        {editingProposal === realIdx ? (
                                            <input
                                                type="text"
                                                value={p.title}
                                                onChange={(e) => onEditChange('title', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span className="font-semibold">{p.title}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingProposal === realIdx ? (
                                            <input
                                                type="text"
                                                value={p.client}
                                                onChange={(e) => onEditChange('client', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            p.client
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingProposal === realIdx ? (
                                            <input
                                                type="date"
                                                value={p.deadline}
                                                onChange={(e) => onEditChange('deadline', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            new Date(p.deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingProposal === realIdx ? (
                                            <select
                                                value={p.status}
                                                onChange={(e) => onEditChange('status', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            >
                                                <option value="In Progress">In Progress</option>
                                                <option value="Submitted">Submitted</option>
                                                <option value="Won">Won</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        ) : (
                                            <StatusBadge status={p.status} />
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingProposal === realIdx ? (
                                            <select
                                                value={currentEditor[realIdx] || p.currentEditor}
                                                onChange={(e) => setCurrentEditor(prev => ({ ...prev, [realIdx]: e.target.value }))}
                                                className="w-full px-2 py-1 border rounded"
                                            >
                                                <option value="">Select Editor</option>
                                                <option value="user1">User 1</option>
                                                <option value="user2">User 2</option>
                                            </select>
                                        ) : (
                                            p.currentEditor || 'Unassigned'
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            {editingProposal === realIdx ? (
                                                <>
                                                    <button
                                                        onClick={() => onSaveProposal(p.id)}
                                                        disabled={deletingProposal[realIdx]}
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {deletingProposal[realIdx] ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            'Save'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => onEditClick(null, null)}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                    >
                                                        <MdOutlineClose className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEditClick(realIdx, p)}
                                                        disabled={role === "Viewer"}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        <MdOutlineEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onSetCurrentEditor(realIdx, p.currentEditor)}
                                                        disabled={role === "Viewer"}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                                    >
                                                        <MdPersonAddAlt1 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeletePermanently(realIdx)}
                                                        disabled={role === "Viewer" || deletingPermanently[realIdx]}
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        {deletingPermanently[realIdx] ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            <MdOutlineDeleteForever className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedProposals.length === 0 && (
                            <tr>
                                <td colSpan={showDeleteOptions ? 7 : 6} className="text-center py-4">No proposals found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 my-2 px-4">
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-[#2563EB] text-white' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProposalsTable;
