import React, { useState } from 'react';
import { MdOutlineEdit, MdOutlineBusinessCenter, MdOutlineLocationOn, MdOutlineMail, MdOutlineCall, MdOutlineLanguage, MdOutlineGroups, MdOutlineDocumentScanner, MdOutlineFolder, MdOutlineAssignment, MdOutlineVerifiedUser, MdOutlinePayments } from 'react-icons/md';
import StatusBadge from './StatusBadge';
import { formatDate, formatCurrency } from './constants.jsx';

const OverviewSection = ({ profile, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        companyName: profile?.companyName || '',
        industry: profile?.industry || '',
        companySize: profile?.companySize || '',
        website: profile?.website || '',
        description: profile?.description || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        country: profile?.country || '',
        zipCode: profile?.zipCode || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
    });

    const handleSave = () => {
        onEdit(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            companyName: profile?.companyName || '',
            industry: profile?.industry || '',
            companySize: profile?.companySize || '',
            website: profile?.website || '',
            description: profile?.description || '',
            address: profile?.address || '',
            city: profile?.city || '',
            state: profile?.state || '',
            country: profile?.country || '',
            zipCode: profile?.zipCode || '',
            phone: profile?.phone || '',
            email: profile?.email || '',
        });
        setIsEditing(false);
    };

    const stats = [
        {
            label: 'Team Members',
            value: profile?.teamMembers?.length || 0,
            icon: <MdOutlineGroups className="w-6 h-6" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Active Proposals',
            value: profile?.proposals?.filter(p => p.status === 'In Progress').length || 0,
            icon: <MdOutlineDocumentScanner className="w-6 h-6" />,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            label: 'Documents',
            value: profile?.documents?.length || 0,
            icon: <MdOutlineFolder className="w-6 h-6" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            label: 'Case Studies',
            value: profile?.caseStudies?.length || 0,
            icon: <MdOutlineAssignment className="w-6 h-6" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            label: 'Certificates',
            value: profile?.certificates?.length || 0,
            icon: <MdOutlineVerifiedUser className="w-6 h-6" />,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
        },
        {
            label: 'Total Revenue',
            value: formatCurrency(profile?.totalRevenue || 0),
            icon: <MdOutlinePayments className="w-6 h-6" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <MdOutlineEdit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                            <span className={stat.color}>{stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>

                {isEditing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={editData.companyName}
                                    onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                <input
                                    type="text"
                                    value={editData.industry}
                                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                <select
                                    value={editData.companySize}
                                    onChange={(e) => setEditData({ ...editData, companySize: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={editData.website}
                                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <MdOutlineBusinessCenter className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Company Name</div>
                                        <div className="font-medium text-gray-900">{profile?.companyName || 'Not provided'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MdOutlineBusinessCenter className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Industry</div>
                                        <div className="font-medium text-gray-900">{profile?.industry || 'Not provided'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MdOutlineGroups className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Company Size</div>
                                        <div className="font-medium text-gray-900">{profile?.companySize || 'Not provided'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MdOutlineLanguage className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Website</div>
                                        <div className="font-medium text-gray-900">
                                            {profile?.website ? (
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {profile.website}
                                                </a>
                                            ) : 'Not provided'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <MdOutlineLocationOn className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Address</div>
                                        <div className="font-medium text-gray-900">
                                            {profile?.address ? `${profile.address}, ${profile.city}, ${profile.state} ${profile.zipCode}, ${profile.country}` : 'Not provided'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MdOutlinePhone className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div className="font-medium text-gray-900">{profile?.phone || 'Not provided'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MdOutlineMail className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <div className="font-medium text-gray-900">{profile?.email || 'Not provided'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {profile?.description && (
                            <div className="pt-4 border-t">
                                <div className="text-sm text-gray-500 mb-2">Description</div>
                                <div className="text-gray-900">{profile.description}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {profile?.recentActivity?.length > 0 ? (
                        profile.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-900">{activity.description}</div>
                                    <div className="text-xs text-gray-500">{formatDate(activity.date)}</div>
                                </div>
                                <StatusBadge status={activity.status} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-lg mb-2">No recent activity</div>
                            <div className="text-sm">Activity will appear here as you use the platform</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
