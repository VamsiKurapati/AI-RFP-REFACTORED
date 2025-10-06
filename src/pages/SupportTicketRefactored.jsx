import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import NavbarComponent from "../components/layout/NavbarComponent";
import SupportTicketForm from "../components/support/SupportTicketForm";
import SupportTicketList from "../components/support/SupportTicketList";
import axios from "axios";
import Swal from "sweetalert2";

const SupportTicketRefactored = () => {
    const { role, userId } = useUser();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTickets, setFetchingTickets] = useState(true);

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/tickets`;

    // Fetch tickets on component mount
    useEffect(() => {
        fetchTickets();
    }, [userId]);

    const fetchTickets = async () => {
        if (!userId) return;

        try {
            setFetchingTickets(true);
            const response = await axios.get(`${baseUrl}?userId=${userId}`);
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch support tickets',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setFetchingTickets(false);
        }
    };

    const handleCreateTicket = async (ticketData) => {
        try {
            setLoading(true);

            const response = await axios.post(baseUrl, {
                ...ticketData,
                userId: userId,
            });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Support ticket created successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });

                // Refresh tickets list
                await fetchTickets();
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create support ticket',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTicketUpdate = async () => {
        await fetchTickets();
    };

    if (fetchingTickets) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavbarComponent />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
                    <p className="text-gray-600">
                        Get help with your account, billing, or technical issues
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create Ticket Form */}
                    <div>
                        <SupportTicketForm
                            onSubmit={handleCreateTicket}
                            loading={loading}
                        />
                    </div>

                    {/* Tickets List */}
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Support Tickets</h2>
                            <SupportTicketList
                                tickets={tickets}
                                onTicketUpdate={handleTicketUpdate}
                                userId={userId}
                            />
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                            <p className="text-gray-600 text-sm">Find answers to common questions</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                            <p className="text-gray-600 text-sm">support@rfpapp.com</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                            <p className="text-gray-600 text-sm">Usually within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketRefactored;
