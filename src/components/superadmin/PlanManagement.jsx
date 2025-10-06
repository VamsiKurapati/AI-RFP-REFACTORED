import React, { useState, useEffect } from 'react';
import { MdOutlineAdd, MdOutlineEdit, MdOutlineDelete, MdOutlineVisibility, MdOutlineSearch, MdOutlineFilterList } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';

const PlanManagement = ({ baseUrl }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        billingCycle: 'monthly',
        features: [],
        maxUsers: '',
        maxProjects: '',
        maxStorage: '',
        isActive: true
    });

    // Fetch plans
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/admin/plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(response.data.plans || []);
        } catch (error) {
            console.error('Error fetching plans:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch subscription plans',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Filter plans
    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && plan.isActive) ||
            (statusFilter === 'inactive' && !plan.isActive);
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedPlans = filteredPlans.slice(startIndex, startIndex + rowsPerPage);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = selectedPlan ?
                `${baseUrl}/admin/plans/${selectedPlan._id}` :
                `${baseUrl}/admin/plans`;

            const method = selectedPlan ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: 'Success!',
                text: selectedPlan ? 'Plan updated successfully' : 'Plan created successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedPlan(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                billingCycle: 'monthly',
                features: [],
                maxUsers: '',
                maxProjects: '',
                maxStorage: '',
                isActive: true
            });
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save plan',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    // Handle delete
    const handleDelete = async (plan) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the plan "${plan.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${baseUrl}/admin/plans/${plan._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Plan has been deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });

                fetchPlans();
            } catch (error) {
                console.error('Error deleting plan:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete plan',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        }
    };

    // Handle edit
    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setFormData({
            name: plan.name || '',
            description: plan.description || '',
            price: plan.price || '',
            billingCycle: plan.billingCycle || 'monthly',
            features: plan.features || [],
            maxUsers: plan.maxUsers || '',
            maxProjects: plan.maxProjects || '',
            maxStorage: plan.maxStorage || '',
            isActive: plan.isActive !== undefined ? plan.isActive : true
        });
        setShowEditModal(true);
    };

    // Handle view
    const handleView = (plan) => {
        setSelectedPlan(plan);
        setShowViewModal(true);
    };

    // Add feature
    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    // Remove feature
    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    // Update feature
    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Plan Management</h2>
                    <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <MdOutlineAdd className="w-4 h-4" />
                    Add Plan
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
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

            {/* Plans Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading plans...</p>
                    </div>
                ) : filteredPlans.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdOutlineAdd className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans found</h3>
                        <p className="text-gray-600 mb-6">Create your first subscription plan to get started</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                        >
                            <MdOutlineAdd className="w-4 h-4" />
                            Add Plan
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plan Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Billing Cycle
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subscribers
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedPlans.map((plan) => (
                                        <tr key={plan._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                                    <div className="text-sm text-gray-500">{plan.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${plan.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                {plan.billingCycle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${plan.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {plan.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {plan.subscriberCount || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleView(plan)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View details"
                                                    >
                                                        <MdOutlineVisibility className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(plan)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="Edit plan"
                                                    >
                                                        <MdOutlineEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(plan)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete plan"
                                                    >
                                                        <MdOutlineDelete className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                                            <span className="font-medium">
                                                {Math.min(startIndex + rowsPerPage, filteredPlans.length)}
                                            </span>{' '}
                                            of <span className="font-medium">{filteredPlans.length}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => (
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
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Plan Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Plan Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Billing Cycle *
                                        </label>
                                        <select
                                            value={formData.billingCycle}
                                            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Users
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxUsers}
                                            onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Projects
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxProjects}
                                            onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Storage (GB)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxStorage}
                                            onChange={(e) => setFormData({ ...formData, maxStorage: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Features
                                    </label>
                                    <div className="space-y-2">
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => updateFeature(index, e.target.value)}
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter feature"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                >
                                                    <MdOutlineDelete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <MdOutlineAdd className="w-4 h-4" />
                                            Add Feature
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                        Active Plan
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {selectedPlan ? 'Update Plan' : 'Create Plan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                            setSelectedPlan(null);
                                            setFormData({
                                                name: '',
                                                description: '',
                                                price: '',
                                                billingCycle: 'monthly',
                                                features: [],
                                                maxUsers: '',
                                                maxProjects: '',
                                                maxStorage: '',
                                                isActive: true
                                            });
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Plan Modal */}
            {showViewModal && selectedPlan && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Details</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                                        <p className="text-gray-900">{selectedPlan.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <p className="text-gray-900">${selectedPlan.price}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                                        <p className="text-gray-900 capitalize">{selectedPlan.billingCycle}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedPlan.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedPlan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <p className="text-gray-900">{selectedPlan.description}</p>
                                </div>

                                {selectedPlan.features && selectedPlan.features.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Features</label>
                                        <ul className="list-disc list-inside text-gray-900">
                                            {selectedPlan.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Users</label>
                                        <p className="text-gray-900">{selectedPlan.maxUsers || 'Unlimited'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Projects</label>
                                        <p className="text-gray-900">{selectedPlan.maxProjects || 'Unlimited'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Storage</label>
                                        <p className="text-gray-900">{selectedPlan.maxStorage ? `${selectedPlan.maxStorage} GB` : 'Unlimited'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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

export default PlanManagement;
