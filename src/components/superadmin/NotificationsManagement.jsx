import React, { useState, useEffect } from 'react';
import { MdOutlineSearch, MdOutlineFilterList, MdOutlineVisibility, MdOutlineDelete, MdOutlineRefresh, MdOutlineAdd, MdOutlineEdit } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';

const NotificationsManagement = ({ baseUrl }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [stats, setStats] = useState({
        totalNotifications: 0,
        unreadNotifications: 0,
        sentToday: 0,
        clickRate: 0
    });

    // Create notification form state
    const [createForm, setCreateForm] = useState({
        title: '',
        message: '',
        category: 'general',
        targetAudience: 'all',
        scheduledTime: '',
        isImmediate: true
    });
    const [creating, setCreating] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/admin/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.notifications || []);
            setStats(response.data.stats || stats);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch notifications',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTime = timeFilter === 'all' ||
            (timeFilter === 'today' && isToday(notification.createdAt)) ||
            (timeFilter === 'week' && isThisWeek(notification.createdAt)) ||
            (timeFilter === 'month' && isThisMonth(notification.createdAt));

        const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;

        return matchesSearch && matchesTime && matchesCategory && matchesStatus;
    });

    // Date helper functions
    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    };

    const isThisWeek = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
    };

    const isThisMonth = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get category badge color
    const getCategoryBadgeColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'system':
                return 'bg-blue-100 text-blue-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'feature':
                return 'bg-green-100 text-green-800';
            case 'security':
                return 'bg-red-100 text-red-800';
            case 'general':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Create notification
    const createNotification = async () => {
        if (!createForm.title.trim() || !createForm.message.trim()) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill in all required fields',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        try {
            setCreating(true);
            const token = localStorage.getItem('token');
            await axios.post(`${baseUrl}/admin/notifications`, createForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCreateForm({
                title: '',
                message: '',
                category: 'general',
                targetAudience: 'all',
                scheduledTime: '',
                isImmediate: true
            });
            setShowCreateModal(false);

            Swal.fire({
                title: 'Success!',
                text: 'Notification created successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            // Refresh notifications
            fetchNotifications();
        } catch (error) {
            console.error('Error creating notification:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to create notification',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setCreating(false);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
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
                const token = localStorage.getItem('token');
                await axios.delete(`${baseUrl}/admin/notifications/${notificationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setNotifications(prev => prev.filter(n => n._id !== notificationId));

                Swal.fire('Deleted!', 'Notification has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting notification:', error);
                Swal.fire('Error!', 'Failed to delete notification.', 'error');
            }
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredNotifications.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications Management</h2>
                    <p className="text-gray-600 mt-1">Create and manage system notifications</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Create Notification
                    </button>
                    <button
                        onClick={fetchNotifications}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <MdOutlineRefresh className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7M4.828 7H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2.172" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalNotifications}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Unread</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.unreadNotifications}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Sent Today</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.sentToday}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Click Rate</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.clickRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="system">System</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="feature">Feature</option>
                            <option value="security">Security</option>
                            <option value="general">General</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="failed">Failed</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Notifications Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Target Audience
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : paginatedNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No notifications found
                                    </td>
                                </tr>
                            ) : (
                                paginatedNotifications.map((notification) => (
                                    <tr key={notification._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                            {notification.title || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(notification.category)}`}>
                                                {notification.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {notification.targetAudience || 'All Users'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(notification.status)}`}>
                                                {notification.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(notification.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedNotification(notification);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Details"
                                                >
                                                    <MdOutlineVisibility className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <MdOutlineDelete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Notification Modal */}
            {showViewModal && selectedNotification && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Details</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(selectedNotification.category)}`}>
                                            {selectedNotification.category || 'General'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedNotification.status)}`}>
                                            {selectedNotification.status || 'Draft'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                                        <p className="text-sm text-gray-900">{selectedNotification.targetAudience || 'All Users'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Created</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedNotification.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <p className="text-sm text-gray-900">{selectedNotification.title || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedNotification.message || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedNotification(null);
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

            {/* Create Notification Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Notification</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={createForm.title}
                                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter notification title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                    <textarea
                                        value={createForm.message}
                                        onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter notification message..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={createForm.category}
                                            onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="general">General</option>
                                            <option value="system">System</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="feature">Feature</option>
                                            <option value="security">Security</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                        <select
                                            value={createForm.targetAudience}
                                            onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="premium">Premium Users</option>
                                            <option value="enterprise">Enterprise Users</option>
                                            <option value="admin">Admins Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={createForm.isImmediate}
                                            onChange={(e) => setCreateForm({ ...createForm, isImmediate: e.target.checked })}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Send immediately</span>
                                    </label>
                                </div>

                                {!createForm.isImmediate && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                                        <input
                                            type="datetime-local"
                                            value={createForm.scheduledTime}
                                            onChange={(e) => setCreateForm({ ...createForm, scheduledTime: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreateForm({
                                            title: '',
                                            message: '',
                                            category: 'general',
                                            targetAudience: 'all',
                                            scheduledTime: '',
                                            isImmediate: true
                                        });
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createNotification}
                                    disabled={creating}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Notification'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsManagement;
