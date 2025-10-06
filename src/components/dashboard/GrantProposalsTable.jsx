import React from 'react';
import { MdOutlineEdit, MdOutlineSearch, MdOutlineRotateLeft, MdOutlineDeleteForever, MdPersonAddAlt1, MdOutlineClose } from "react-icons/md";
import StatusBadge from './StatusBadge';
import { PAGE_SIZE } from './constants';

const GrantProposalsTable = ({
    grantProposals,
    currentGrantPage,
    setCurrentGrantPage,
    totalGrantPages,
    selectedGrantProposals,
    showGrantDeleteOptions,
    editingGrantProposal,
    deletingGrantProposal,
    deletingGrantPermanently,
    currentGrantEditor,
    setCurrentGrantEditor,
    onSelectGrantProposal,
    onEditGrantClick,
    onEditGrantChange,
    onSaveGrantProposal,
    onSetGrantCurrentEditor,
    onDeleteGrantProposals,
    onDeleteGrantPermanently,
    onRestoreGrantProposal,
    role
}) => {
    const paginatedGrantProposals = grantProposals.slice((currentGrantPage - 1) * PAGE_SIZE, currentGrantPage * PAGE_SIZE);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#111827]">Grant Proposals</h2>
                <div className="flex gap-2">
                    {showGrantDeleteOptions && (
                        <button
                            onClick={onDeleteGrantProposals}
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
                            {showGrantDeleteOptions && <th className="text-left py-2">Select</th>}
                            <th className="text-left py-2">Opportunity Title</th>
                            <th className="text-left py-2">Agency Name</th>
                            <th className="text-left py-2">Close Date</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Current Editor</th>
                            <th className="text-left py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedGrantProposals.map((p, idx) => {
                            const realIdx = (currentGrantPage - 1) * PAGE_SIZE + idx;
                            return (
                                <tr key={realIdx} className="border-t">
                                    {showGrantDeleteOptions && (
                                        <td className="px-2 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedGrantProposals.includes(realIdx)}
                                                onChange={() => onSelectGrantProposal(realIdx)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-4 py-2">
                                        {editingGrantProposal === realIdx ? (
                                            <input
                                                type="text"
                                                value={p.OPPORTUNITY_TITLE || ''}
                                                onChange={(e) => onEditGrantChange('OPPORTUNITY_TITLE', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span className="font-semibold">{p.OPPORTUNITY_TITLE || 'Not Provided'}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingGrantProposal === realIdx ? (
                                            <input
                                                type="text"
                                                value={p.AGENCY_NAME || ''}
                                                onChange={(e) => onEditGrantChange('AGENCY_NAME', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            p.AGENCY_NAME || 'Not Provided'
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingGrantProposal === realIdx ? (
                                            <input
                                                type="date"
                                                value={p.CLOSE_DATE || ''}
                                                onChange={(e) => onEditGrantChange('CLOSE_DATE', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            p.CLOSE_DATE ? new Date(p.CLOSE_DATE).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : "No close date"
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingGrantProposal === realIdx ? (
                                            <select
                                                value={p.OPPORTUNITY_STATUS || p.status}
                                                onChange={(e) => onEditGrantChange('OPPORTUNITY_STATUS', e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            >
                                                <option value="Posted">Posted</option>
                                                <option value="Forecasted">Forecasted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        ) : (
                                            <StatusBadge status={p.OPPORTUNITY_STATUS || p.status} />
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingGrantProposal === realIdx ? (
                                            <select
                                                value={currentGrantEditor[realIdx] || p.currentEditor}
                                                onChange={(e) => setCurrentGrantEditor(prev => ({ ...prev, [realIdx]: e.target.value }))}
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
                                            {editingGrantProposal === realIdx ? (
                                                <>
                                                    <button
                                                        onClick={() => onSaveGrantProposal(p.id)}
                                                        disabled={deletingGrantProposal[realIdx]}
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {deletingGrantProposal[realIdx] ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            'Save'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => onEditGrantClick(null, null)}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                    >
                                                        <MdOutlineClose className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEditGrantClick(realIdx, p)}
                                                        disabled={role === "Viewer"}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        <MdOutlineEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onSetGrantCurrentEditor(realIdx, p.currentEditor)}
                                                        disabled={role === "Viewer"}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                                    >
                                                        <MdPersonAddAlt1 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteGrantPermanently(realIdx)}
                                                        disabled={role === "Viewer" || deletingGrantPermanently[realIdx]}
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        {deletingGrantPermanently[realIdx] ? (
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
                        {paginatedGrantProposals.length === 0 && (
                            <tr>
                                <td colSpan={showGrantDeleteOptions ? 7 : 6} className="text-center py-4">No grant proposals found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 my-2 px-4">
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentGrantPage(p => Math.max(1, p - 1))}
                    disabled={currentGrantPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalGrantPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-2 py-1 border rounded ${currentGrantPage === i + 1 ? 'bg-[#2563EB] text-white' : ''}`}
                        onClick={() => setCurrentGrantPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentGrantPage(p => Math.min(totalGrantPages, p + 1))}
                    disabled={currentGrantPage === totalGrantPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GrantProposalsTable;
