import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/layout/NavbarComponent";
import { useProfile } from "../../context/ProfileContext";
import ProfileSidebar, { MobileDropdown } from "../../components/profile/ProfileSidebar";
import OverviewSection from "../../components/profile/OverviewSection";
import TeamDetailsSection from "../../components/profile/TeamDetailsSection";
import { API_ENDPOINTS } from "../../components/profile/constants.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const CompanyProfileDashboardRefactored = () => {
    const navigate = useNavigate();
    const { profile, updateProfile } = useProfile();
    const [activeTab, setActiveTab] = useState("Overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [caseStudies, setCaseStudies] = useState([]);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch all profile data in parallel
            const [
                profileResponse,
                teamResponse,
                proposalsResponse,
                documentsResponse,
                caseStudiesResponse,
                certificatesResponse
            ] = await Promise.allSettled([
                axios.get(API_ENDPOINTS.GET_COMPANY_PROFILE, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_TEAM_MEMBERS, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_PROPOSALS, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_DOCUMENTS, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_CASE_STUDIES, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_CERTIFICATES, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            // Update state with successful responses
            if (profileResponse.status === 'fulfilled') {
                updateProfile(profileResponse.value.data);
            }

            if (teamResponse.status === 'fulfilled') {
                setTeamMembers(teamResponse.value.data.teamMembers || []);
            }

            if (proposalsResponse.status === 'fulfilled') {
                setProposals(proposalsResponse.value.data.proposals || []);
            }

            if (documentsResponse.status === 'fulfilled') {
                setDocuments(documentsResponse.value.data.documents || []);
            }

            if (caseStudiesResponse.status === 'fulfilled') {
                setCaseStudies(caseStudiesResponse.value.data.caseStudies || []);
            }

            if (certificatesResponse.status === 'fulfilled') {
                setCertificates(certificatesResponse.value.data.certificates || []);
            }

        } catch (error) {
            console.error('Error fetching profile data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load profile data',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                API_ENDPOINTS.UPDATE_COMPANY_PROFILE,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            updateProfile(response.data);

            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update profile',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleAddTeamMember = async (memberData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                API_ENDPOINTS.ADD_TEAM_MEMBER,
                memberData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setTeamMembers(prev => [...prev, response.data.teamMember]);
        } catch (error) {
            console.error('Error adding team member:', error);
            throw error;
        }
    };

    const handleEditTeamMember = async (member) => {
        // This would open an edit modal - for now, just show a placeholder
        Swal.fire({
            title: 'Edit Team Member',
            text: 'Edit functionality will be implemented in the next iteration',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const handleDeleteTeamMember = async (member) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${API_ENDPOINTS.DELETE_TEAM_MEMBER}/${member._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setTeamMembers(prev => prev.filter(m => m._id !== member._id));
        } catch (error) {
            console.error('Error deleting team member:', error);
            throw error;
        }
    };

    const renderActiveSection = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <OverviewSection
                        profile={{
                            ...profile,
                            teamMembers,
                            proposals,
                            documents,
                            caseStudies,
                            certificates
                        }}
                        onEdit={handleProfileUpdate}
                    />
                );
            case "Team Details":
                return (
                    <TeamDetailsSection
                        teamMembers={teamMembers}
                        onAddMember={handleAddTeamMember}
                        onEditMember={handleEditTeamMember}
                        onDeleteMember={handleDeleteTeamMember}
                    />
                );
            case "Proposals":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Proposals</h2>
                        <p className="text-gray-600">Proposals section will be implemented in the next iteration.</p>
                    </div>
                );
            case "Documents":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Documents</h2>
                        <p className="text-gray-600">Documents section will be implemented in the next iteration.</p>
                    </div>
                );
            case "Case Studies":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Studies</h2>
                        <p className="text-gray-600">Case Studies section will be implemented in the next iteration.</p>
                    </div>
                );
            case "Certificates":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Certificates</h2>
                        <p className="text-gray-600">Certificates section will be implemented in the next iteration.</p>
                    </div>
                );
            case "Payment":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment</h2>
                        <p className="text-gray-600">Payment section will be implemented in the next iteration.</p>
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                        <p className="text-gray-600">Select a section from the sidebar to get started.</p>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavbarComponent />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />

            <div className="flex">
                {/* Desktop Sidebar */}
                <ProfileSidebar
                    active={activeTab}
                    onSelect={setActiveTab}
                />

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <ProfileSidebar
                        isMobile={true}
                        active={activeTab}
                        onSelect={setActiveTab}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 ml-64">
                    <div className="p-6">
                        {/* Mobile Header */}
                        <div className="lg:hidden mb-6">
                            <div className="relative">
                                <MobileDropdown
                                    activeTab={activeTab}
                                    onSelect={setActiveTab}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        {renderActiveSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileDashboardRefactored;
