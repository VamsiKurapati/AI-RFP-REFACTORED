import React, { useState } from 'react';
import { MdOutlineEdit, MdOutlineDelete, MdOutlinePhone, MdOutlineEmail, MdOutlineClose, MdOutlineAdd } from 'react-icons/md';
import StatusBadge from './StatusBadge';
import PhoneNumberInput, { validatePhoneNumber } from '../forms/PhoneNumberInput';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_ENDPOINTS } from './constants.jsx';

// Team Member Card Component
const TeamMemberCard = ({ member, onEdit, onDelete, onContact }) => {
    const [showContactModal, setShowContactModal] = useState(false);

    const contactOptions = [
        {
            icon: <MdOutlineEmail className="w-5 h-5" />,
            label: "Send Email",
            action: () => window.open(`mailto:${member.email}`)
        },
        {
            icon: <MdOutlinePhone className="w-5 h-5" />,
            label: "Call",
            action: () => window.open(`tel:${member.phone}`)
        },
    ];

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                                {member.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.jobTitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={member.accessLevel} />
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(member)}
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                title="Edit member"
                            >
                                <MdOutlineEdit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                                title="Contact member"
                            >
                                <MdOutlinePhone className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(member)}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                title="Delete member"
                            >
                                <MdOutlineDelete className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MdOutlineEmail className="w-4 h-4" />
                        <span>{member.email || "Email not available."}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MdOutlinePhone className="w-4 h-4" />
                        <span>{member.phone || "Phone not available."}</span>
                    </div>
                </div>

                <div className="pt-4 border-t mt-4">
                    <h5 className="font-medium mb-2">Short Description</h5>
                    <p className="text-gray-600 text-sm">
                        {member.shortDesc || "No description available."}
                    </p>
                </div>

                {member.skills && (
                    <div className="pt-4 border-t mt-4">
                        <h5 className="font-medium mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.split(',').map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {member.highestQualification && (
                    <div className="pt-4 border-t mt-4">
                        <h5 className="font-medium mb-2">Highest Qualification</h5>
                        <p className="text-gray-600 text-sm">{member.highestQualification}</p>
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowContactModal(false)}></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-80 max-w-[90vw] z-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Contact {member.name}</h3>
                            <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700">
                                <MdOutlineClose className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {contactOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        option.action();
                                        setShowContactModal(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    {option.icon}
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// Add Team Member Modal
const AddTeamMemberModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        jobTitle: '',
        email: '',
        shortDesc: '',
        highestQualification: '',
        skills: '',
        phone: '',
        accessLevel: 'Member'
    });

    const [addingTeamMember, setAddingTeamMember] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddingTeamMember(true);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneError = validatePhoneNumber(formData.phone, true);

        if (!formData.name || !formData.shortDesc || !formData.highestQualification || !formData.skills || !formData.jobTitle || !formData.phone || !formData.accessLevel || !formData.email) {
            Swal.fire({
                title: 'Please fill in all fields.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            setAddingTeamMember(false);
            return;
        }

        if (phoneError) {
            Swal.fire({
                title: phoneError,
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            setAddingTeamMember(false);
            return;
        }

        if (!emailRegex.test(formData.email)) {
            Swal.fire({
                title: 'Please enter a valid email address.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            setAddingTeamMember(false);
            return;
        }

        try {
            await onAdd(formData);
            setFormData({
                name: '',
                jobTitle: '',
                email: '',
                shortDesc: '',
                highestQualification: '',
                skills: '',
                phone: '',
                accessLevel: 'Member'
            });
            onClose();
        } catch (error) {
            console.error('Error adding team member:', error);
        } finally {
            setAddingTeamMember(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-50">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Add Team Member</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <PhoneNumberInput
                            value={formData.phone}
                            onChange={(value) => setFormData({ ...formData, phone: value })}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Access Level *</label>
                        <select
                            value={formData.accessLevel}
                            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                        <textarea
                            value={formData.shortDesc}
                            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification *</label>
                        <input
                            type="text"
                            value={formData.highestQualification}
                            onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills * (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., React, Node.js, Python"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={addingTeamMember}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {addingTeamMember ? 'Adding...' : 'Add Member'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

const TeamDetailsSection = ({ teamMembers, onAddMember, onEditMember, onDeleteMember }) => {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddMember = async (memberData) => {
        try {
            await onAddMember(memberData);
            Swal.fire({
                title: 'Success!',
                text: 'Team member added successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add team member',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const handleDeleteMember = async (member) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to remove ${member.name} from the team?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove!'
        });

        if (result.isConfirmed) {
            try {
                await onDeleteMember(member);
                Swal.fire({
                    title: 'Removed!',
                    text: 'Team member has been removed',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to remove team member',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Details</h2>
                    <p className="text-gray-600 mt-1">Manage your team members and their access levels</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <MdOutlineAdd className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Team Members Grid */}
            {teamMembers && teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard
                            key={member._id || index}
                            member={member}
                            onEdit={onEditMember}
                            onDelete={handleDeleteMember}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdOutlineAdd className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
                    <p className="text-gray-600 mb-6">Add your first team member to get started</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                        <MdOutlineAdd className="w-4 h-4" />
                        Add Team Member
                    </button>
                </div>
            )}

            {/* Add Team Member Modal */}
            <AddTeamMemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddMember}
            />
        </div>
    );
};

export default TeamDetailsSection;
