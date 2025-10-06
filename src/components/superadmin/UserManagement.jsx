import React, { useState, useEffect } from 'react';
import { MdOutlineSearch, MdOutlineFilterList, MdOutlineVisibility, MdOutlineBlock } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const UserManagement = ({
    searchTerm,
    setSearchTerm,
    userStatusFilter,
    setUserStatusFilter,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    companiesData,
    setCompaniesData,
    filteredUsers,
    setFilteredUsers,
    viewUserModal,
    setViewUserModal,
    selectedUser,
    setSelectedUser,
    baseUrl
}) => {
    const [usersStats, setUsersStats] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch users data
    const fetchUsersData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/admin/getAllCompanies`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setCompaniesData(response.data.data);
                setFilteredUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users stats
    const fetchUsersStats = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/getUsersStats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setUsersStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching users stats:', error);
        }
    };

    // Handle user block toggle
    const handleUserBlockToggle = async (userId, currentBlockedStatus) => {
        try {
            const newBlockedStatus = !currentBlockedStatus;
            const res = await axios.put(`${baseUrl}/admin/updateCompanyStatus/${userId}`, {
                blocked: newBlockedStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 200) {
                setCompaniesData(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                setFilteredUsers(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                toast.success(`User ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
            }
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    // Open user modal
    const openUserModal = (user) => {
        setSelectedUser(user);
        setViewUserModal(true);
    };

    // Filter users
    useEffect(() => {
        let filtered = companiesData || [];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (userStatusFilter !== 'all') {
            filtered = filtered.filter(user => {
                if (userStatusFilter === 'active') return !user.blocked;
                if (userStatusFilter === 'blocked') return user.blocked;
                return true;
            });
        }

        setFilteredUsers(filtered);
    }, [companiesData, searchTerm, userStatusFilter]);

    useEffect(() => {
        fetchUsersData();
        fetchUsersStats();
    }, []);

    // Pagination
    const totalPages = Math.ceil((filteredUsers || []).length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentUsers = (filteredUsers || []).slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MdOutlinePerson className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-semibold text-gray-900">{usersStats.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <MdOutlinePerson className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <p className="text-2xl font-semibold text-gray-900">{usersStats.activeUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <MdOutlineBlock className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Blocked Users</p>
                            <p className="text-2xl font-semibold text-gray-900">{usersStats.blockedUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <MdOutlinePerson className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">New This Month</p>
                            <p className="text-2xl font-semibold text-gray-900">{usersStats.newUsersThisMonth || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={userStatusFilter}
                            onChange={(e) => setUserStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>

                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Person
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.companyName || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {user.contactPerson || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {user.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.blocked
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.blocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openUserModal(user)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <MdOutlineVisibility className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleUserBlockToggle(user._id, user.blocked)}
                                                    className={`${user.blocked
                                                            ? 'text-green-600 hover:text-green-900'
                                                            : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                >
                                                    <MdOutlineBlock className="h-5 w-5" />
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
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
