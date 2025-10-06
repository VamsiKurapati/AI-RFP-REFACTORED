import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import ToastContainer from '../../components/ui/ToastContainer';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Import SuperAdmin components
import SuperAdminNavigation from '../../components/superadmin/SuperAdminNavigation';
import UserManagement from '../../components/superadmin/UserManagement';
import PlanManagement from '../../components/superadmin/PlanManagement';
import PaymentsManagement from '../../components/superadmin/PaymentsManagement';
import SupportManagement from '../../components/superadmin/SupportManagement';
import NotificationsManagement from '../../components/superadmin/NotificationsManagement';

const SuperAdminRefactored = () => {
    const navigate = useNavigate();

    // Main navigation state
    const [activeTab, setActiveTab] = useState(() => {
        return window.location.hash.slice(1) ? window.location.hash.slice(1) : 'user-management';
    });
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Search terms
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    // Inner tabs
    const [supportTab, setSupportTab] = useState('Enterprise');

    // View modals
    const [viewUserModal, setViewUserModal] = useState(false);
    const [viewSupportModal, setViewSupportModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupport, setSelectedSupport] = useState(null);

    // Invoice modal states
    const [openInvoiceRows, setOpenInvoiceRows] = useState(new Set());

    // Refs
    const supportResolvedDescriptionRef = useRef(null);
    const adminMessageRef = useRef('');

    // Filters
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
    const [transactionDateFilter, setTransactionDateFilter] = useState('all');
    const [supportStatusFilter, setSupportStatusFilter] = useState('all');
    const [supportPriorityFilter, setSupportPriorityFilter] = useState('all');
    const [supportTypeFilter, setSupportTypeFilter] = useState('all');
    const [notificationTimeFilter, setNotificationTimeFilter] = useState('All Time');
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState('All Categories');

    // Filter modals
    const [userFilterModal, setUserFilterModal] = useState(false);
    const [transactionFilterModal, setTransactionFilterModal] = useState(false);
    const [supportFilterModal, setSupportFilterModal] = useState(false);
    const [notificationTimeFilterModal, setNotificationTimeFilterModal] = useState(false);
    const [notificationCategoryFilterModal, setNotificationCategoryFilterModal] = useState(false);

    // Data
    const [usersStats, setUsersStats] = useState({});
    const [companiesData, setCompaniesData] = useState([]);
    const [paymentsStats, setPaymentsStats] = useState({});
    const [paymentsData, setPaymentsData] = useState([]);
    const [supportTicketsStats, setSupportTicketsStats] = useState({});
    const [supportTicketsData, setSupportTicketsData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
    const [currentPageSupport, setCurrentPageSupport] = useState(1);
    const [currentPageEnterpriseSupport, setCurrentPageEnterpriseSupport] = useState(1);
    const [currentPageNotifications, setCurrentPageNotifications] = useState(1);

    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

    // Utility functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const userLocale = navigator.language || 'en-US';
        return date.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Event handlers
    const handleLogout = () => {
        localStorage.clear();
        setTimeout(() => {
            navigate("/");
            window.location.reload();
        }, 1000);
    };

    const handleModalBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setViewUserModal(false);
            setViewSupportModal(false);
            setSelectedUser(null);
            setSelectedSupport(null);
        }
    }, []);

    // URL hash handling
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                setActiveTab(hash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                setViewUserModal(false);
                setViewSupportModal(false);
                setSelectedUser(null);
                setSelectedSupport(null);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);

    // Click outside handling
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showMobileMenu && !e.target.closest('.mobile-menu')) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMobileMenu]);

    // Update URL hash when activeTab changes
    useEffect(() => {
        window.location.hash = activeTab;
    }, [activeTab]);

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'user-management':
                return (
                    <UserManagement
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        userStatusFilter={userStatusFilter}
                        setUserStatusFilter={setUserStatusFilter}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        companiesData={companiesData}
                        setCompaniesData={setCompaniesData}
                        filteredUsers={filteredUsers}
                        setFilteredUsers={setFilteredUsers}
                        viewUserModal={viewUserModal}
                        setViewUserModal={setViewUserModal}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        baseUrl={baseUrl}
                    />
                );
            case 'plan-management':
                return (
                    <PlanManagement
                        baseUrl={baseUrl}
                    />
                );
            case 'payments':
                return (
                    <PaymentsManagement
                        baseUrl={baseUrl}
                    />
                );
            case 'support':
                return (
                    <SupportManagement
                        baseUrl={baseUrl}
                    />
                );
            case 'notifications':
                return (
                    <NotificationsManagement
                        baseUrl={baseUrl}
                    />
                );
            default:
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SuperAdmin</h2>
                        <p className="text-gray-600">Select a section from the navigation to get started.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
                        </div>

                        <SuperAdminNavigation
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            showMobileMenu={showMobileMenu}
                            setShowMobileMenu={setShowMobileMenu}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {renderContent()}
                </div>
            </main>

            {/* Modals */}
            {viewUserModal && selectedUser && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                            <div className="space-y-2">
                                <p><strong>Company:</strong> {selectedUser.companyName || 'N/A'}</p>
                                <p><strong>Contact Person:</strong> {selectedUser.contactPerson || 'N/A'}</p>
                                <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                                <p><strong>Status:</strong> {selectedUser.blocked ? 'Blocked' : 'Active'}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        setViewUserModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewSupportModal && selectedSupport && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Support Ticket Details</h3>
                            <div className="space-y-2">
                                <p><strong>Subject:</strong> {selectedSupport.subject || 'N/A'}</p>
                                <p><strong>Status:</strong> {selectedSupport.status || 'N/A'}</p>
                                <p><strong>Priority:</strong> {selectedSupport.priority || 'N/A'}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        setViewSupportModal(false);
                                        setSelectedSupport(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminRefactored;
