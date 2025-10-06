import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { TbTrashX } from "react-icons/tb";
import Swal from 'sweetalert2';
import axios from 'axios';

const statusSteps = ["Created", "In Progress", "Completed"];

const SupportTicketList = ({ tickets, onTicketUpdate, userId }) => {
    const [expandedTickets, setExpandedTickets] = useState(new Set());
    const [deletingTickets, setDeletingTickets] = useState(new Set());

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/tickets`;

    const toggleTicketExpansion = (ticketId) => {
        const newExpanded = new Set(expandedTickets);
        if (newExpanded.has(ticketId)) {
            newExpanded.delete(ticketId);
        } else {
            newExpanded.add(ticketId);
        }
        setExpandedTickets(newExpanded);
    };

    const handleDeleteTicket = async (ticketId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                setDeletingTickets(prev => new Set(prev).add(ticketId));

                await axios.delete(`${baseUrl}/${ticketId}`);

                // Update the tickets list
                onTicketUpdate();

                Swal.fire('Deleted!', 'Your ticket has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting ticket:', error);
                Swal.fire('Error!', 'Failed to delete ticket.', 'error');
            } finally {
                setDeletingTickets(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(ticketId);
                    return newSet;
                });
            }
        }
    };

    const handleReopenTicket = async (ticketId) => {
        try {
            await axios.put(`${baseUrl}/${ticketId}/reopen`);
            onTicketUpdate();
            Swal.fire('Success!', 'Ticket has been reopened.', 'success');
        } catch (error) {
            console.error('Error reopening ticket:', error);
            Swal.fire('Error!', 'Failed to reopen ticket.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'created':
                return 'bg-blue-100 text-blue-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'withdrawn':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-500 text-lg">No support tickets found</div>
                <div className="text-gray-400 text-sm mt-2">Create your first ticket to get started</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => {
                const isExpanded = expandedTickets.has(ticket._id || ticket.id);
                const isDeleting = deletingTickets.has(ticket._id || ticket.id);

                return (
                    <div key={ticket._id || ticket.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                        {/* Ticket Header */}
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {ticket.subject}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Category:</span> {ticket.category}
                                        {ticket.subCategory && (
                                            <span className="ml-4">
                                                <span className="font-medium">Subcategory:</span> {ticket.subCategory}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleTicketExpansion(ticket._id || ticket.id)}
                                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <FaChevronUp className="w-5 h-5" />
                                        ) : (
                                            <FaChevronDown className="w-5 h-5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteTicket(ticket._id || ticket.id)}
                                        disabled={isDeleting}
                                        className="p-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                        ) : (
                                            <TbTrashX className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <div className="px-6 pb-6 border-t border-gray-200">
                                <div className="pt-6 space-y-4">
                                    {/* Description */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                    </div>

                                    {/* Status Progress */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Status Progress</h4>
                                        <div className="flex items-center space-x-4">
                                            {statusSteps.map((step, index) => {
                                                const isActive = statusSteps.indexOf(ticket.status) >= index;
                                                return (
                                                    <div key={step} className="flex items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isActive
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-600'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <span className={`ml-2 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                                                            }`}>
                                                            {step}
                                                        </span>
                                                        {index < statusSteps.length - 1 && (
                                                            <div className={`w-8 h-0.5 mx-4 ${isActive ? 'bg-blue-600' : 'bg-gray-200'
                                                                }`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Admin Messages */}
                                    {ticket.adminMessages && ticket.adminMessages.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Admin Messages</h4>
                                            <div className="space-y-3">
                                                {ticket.adminMessages.map((message, index) => (
                                                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                                                        <div className="text-sm text-blue-800">
                                                            <strong>Admin:</strong> {message}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resolved Description */}
                                    {ticket.Resolved_Description && (
                                        <div className="mt-6 text-center p-4 bg-gray-100 border-2 border-blue-600 rounded-lg flex items-center">
                                            <span className="text-gray-500 mr-2">Resolved Description:</span>
                                            <span className="text-blue-600 font-medium">
                                                {ticket.Resolved_Description}
                                            </span>
                                        </div>
                                    )}

                                    {/* Reopen Button */}
                                    {(ticket.status === "Completed" || ticket.status === "completed" ||
                                        ticket.status === "Withdrawn" || ticket.status === "withdrawn") && (
                                            <div className="w-full flex justify-center mt-8">
                                                <button
                                                    onClick={() => handleReopenTicket(ticket._id || ticket.id)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
                                                >
                                                    Reopen
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SupportTicketList;
