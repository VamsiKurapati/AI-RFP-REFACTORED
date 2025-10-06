import React, { useEffect, useState, useCallback, useMemo } from 'react';
import NavbarComponent from '../../components/layout/NavbarComponent';
import ProposalsFilter from '../../components/proposals/ProposalsFilter';
import ProposalsGrid from '../../components/proposals/ProposalsGrid';
import GrantProposalForm from '../../components/forms/GrantProposalForm';
import handleWordGeneration from '../../components/ui/Generate_Word';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

// Constants
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
const API_ENDPOINTS = {
    GET_SAVED_AND_DRAFT_RFPS: `${API_BASE_URL}/rfp/getSavedAndDraftRFPs`,
    SAVE_RFP: `${API_BASE_URL}/rfp/saveRFP`,
    UNSAVE_RFP: `${API_BASE_URL}/rfp/unsaveRFP`,
    GET_SAVED_AND_DRAFT_GRANTS: `${API_BASE_URL}/rfp/getSavedAndDraftGrants`,
    SAVE_GRANT: `${API_BASE_URL}/rfp/saveGrant`,
    UNSAVE_GRANT: `${API_BASE_URL}/rfp/unsaveGrant`,
    FETCH_RFP_PROPOSAL: `${API_BASE_URL}/rfp/getRFPProposal`,
    FETCH_GRANT_PROPOSAL: `${API_BASE_URL}/rfp/getGrantProposal`,
};

const ProposalsRefactored = () => {
    const { role: userRole } = useUser();
    const [proposals, setProposals] = useState([]);
    const [grants, setGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);
    const [activeTab, setActiveTab] = useState('rfp');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Fetch proposals and grants
    const fetchProposals = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                return;
            }

            const [rfpResponse, grantsResponse] = await Promise.allSettled([
                axios.get(API_ENDPOINTS.GET_SAVED_AND_DRAFT_RFPS, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(API_ENDPOINTS.GET_SAVED_AND_DRAFT_GRANTS, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (rfpResponse.status === 'fulfilled') {
                setProposals(rfpResponse.value.data.rfps || []);
            }

            if (grantsResponse.status === 'fulfilled') {
                setGrants(grantsResponse.value.data.grants || []);
            }

        } catch (error) {
            console.error('Error fetching proposals:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load proposals',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    // Filter and search logic
    const filteredProposals = useMemo(() => {
        let filtered = activeTab === 'rfp' ? proposals : grants;

        if (searchTerm) {
            filtered = filtered.filter(proposal =>
                proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposal.organization?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(proposal =>
                proposal.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        if (typeFilter) {
            filtered = filtered.filter(proposal =>
                proposal.type?.toLowerCase() === typeFilter.toLowerCase()
            );
        }

        return filtered;
    }, [proposals, grants, activeTab, searchTerm, statusFilter, typeFilter]);

    // Bookmark handlers
    const handleBookmark = useCallback(async (proposal) => {
        try {
            setIsBookmarking(true);
            const token = localStorage.getItem('token');
            const endpoint = proposal.bookmarked
                ? (activeTab === 'rfp' ? API_ENDPOINTS.UNSAVE_RFP : API_ENDPOINTS.UNSAVE_GRANT)
                : (activeTab === 'rfp' ? API_ENDPOINTS.SAVE_RFP : API_ENDPOINTS.SAVE_GRANT);

            await axios.post(endpoint, { id: proposal._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            if (activeTab === 'rfp') {
                setProposals(prev => prev.map(p =>
                    p._id === proposal._id ? { ...p, bookmarked: !p.bookmarked } : p
                ));
            } else {
                setGrants(prev => prev.map(g =>
                    g._id === proposal._id ? { ...g, bookmarked: !g.bookmarked } : g
                ));
            }

            Swal.fire({
                title: 'Success!',
                text: proposal.bookmarked ? 'Proposal unsaved' : 'Proposal saved',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error('Error bookmarking proposal:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update bookmark',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setIsBookmarking(false);
        }
    }, [activeTab]);

    // Share handler
    const handleShare = useCallback((proposal) => {
        if (navigator.share) {
            navigator.share({
                title: proposal.title,
                text: proposal.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: 'Link copied!',
                text: 'Proposal link copied to clipboard',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    }, []);

    // Generate handler
    const handleGenerate = useCallback(async (proposal) => {
        try {
            setIsGenerating(true);
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'rfp'
                ? API_ENDPOINTS.FETCH_RFP_PROPOSAL
                : API_ENDPOINTS.FETCH_GRANT_PROPOSAL;

            const response = await axios.get(`${endpoint}/${proposal._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                await handleWordGeneration(response.data.proposal, activeTab);
            } else {
                throw new Error(response.data.message || 'Failed to fetch proposal data');
            }

        } catch (error) {
            console.error('Error generating proposal:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to generate proposal',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setIsGenerating(false);
        }
    }, [activeTab]);

    // Compliance check handler
    const handleComplianceCheck = useCallback((proposal) => {
        // Navigate to compliance check page
        window.location.href = `/compliance-check?proposalId=${proposal._id}&type=${activeTab}`;
    }, [activeTab]);

    // Clear filters
    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('');
        setTypeFilter('');
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h1>
                    <p className="text-gray-600">
                        Manage your saved and draft proposals
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                    <button
                        onClick={() => setActiveTab('rfp')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'rfp'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        RFP Proposals ({proposals.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('grant')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'grant'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Grant Proposals ({grants.length})
                    </button>
                </div>

                {/* Filters */}
                <ProposalsFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    onClearFilters={handleClearFilters}
                />

                {/* Proposals Grid */}
                <ProposalsGrid
                    proposals={filteredProposals}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    onGenerate={handleGenerate}
                    onComplianceCheck={handleComplianceCheck}
                    userRole={userRole}
                    isLoading={loading}
                    isFetching={isGenerating || isBookmarking}
                />

                {/* Grant Proposal Form Modal */}
                <GrantProposalForm />
            </div>
        </div>
    );
};

export default ProposalsRefactored;
