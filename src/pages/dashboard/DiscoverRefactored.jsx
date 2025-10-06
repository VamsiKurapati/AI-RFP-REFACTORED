import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
    MdOutlineSearch,
    MdOutlineUpload,
    MdOutlineClose,
    MdOutlineExpandMore,
    MdOutlineCheck,
} from "react-icons/md";
import NavbarComponent from "../../components/layout/NavbarComponent";
import { useUser } from "../../context/UserContext";
import GrantProposalForm from "../../components/forms/GrantProposalForm";
import Subscription from "../../components/ui/Subscription";

// Import Discover components
import LeftSidebar from "../../components/discover/LeftSidebar";
import GrantsFilterSidebar from "../../components/discover/GrantsFilterSidebar";
import IndustryMultiSelect from "../../components/discover/IndustryMultiSelect";
import Pagination from "../../components/discover/Pagination";
import RFPCard from "../../components/discover/RFPCard";
import GrantCard from "../../components/discover/GrantCard";

// Constants
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/rfp`;
const STATUS_STYLES = {
    "In Progress": "bg-blue-100 text-blue-600",
    Submitted: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
    Won: "bg-yellow-100 text-yellow-600",
};

const DiscoverRefactored = () => {
    // State management
    const [filters, setFilters] = useState({ category: [], deadline: [] });
    const [grantFilters, setGrantFilters] = useState({
        fundingInstrumentType: [],
        expectedNumberOfAwards: [],
        awardCeiling: [],
        costSharingMatchRequirement: [],
        opportunityStatus: [],
        deadlineRange: []
    });

    // RFP data
    const [recommended, setRecommended] = useState([]);
    const [otherRFPs, setOtherRFPs] = useState([]);
    const [saved, setSaved] = useState([]);
    const [originalRecommended, setOriginalRecommended] = useState([]);
    const [originalOtherRFPs, setOriginalOtherRFPs] = useState([]);
    const [originalSaved, setOriginalSaved] = useState([]);

    // Grant data
    const [recentGrants, setRecentGrants] = useState([]);
    const [otherGrants, setOtherGrants] = useState([]);
    const [savedGrants, setSavedGrants] = useState([]);
    const [originalRecentGrants, setOriginalRecentGrants] = useState([]);
    const [originalOtherGrants, setOriginalOtherGrants] = useState([]);
    const [originalSavedGrants, setOriginalSavedGrants] = useState([]);

    // UI state
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadGrantModalOpen, setUploadGrantModalOpen] = useState(false);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [availableIndustries, setAvailableIndustries] = useState([]);
    const [showGrantProposalModal, setShowGrantProposalModal] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState(null);
    const [isGeneratingGrantProposal, setIsGeneratingGrantProposal] = useState(false);

    // Loading states
    const [loadingOtherRFPs, setLoadingOtherRFPs] = useState(false);
    const [loadingRecommended, setLoadingRecommended] = useState(true);
    const [loadingSave, setLoadingSave] = useState({});
    const [loadingRecentGrants, setLoadingRecentGrants] = useState(true);
    const [loadingOtherGrants, setLoadingOtherGrants] = useState(false);
    const [loadingSaveGrant, setLoadingSaveGrant] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    // Pagination
    const [itemsPerPage] = useState(6);
    const [tableItemsPerPage] = useState(10);
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [currentGrantTablePage, setCurrentGrantTablePage] = useState(1);
    const [currentOtherRFPsPage, setCurrentOtherRFPsPage] = useState(1);
    const [currentOtherGrantsPage, setCurrentOtherGrantsPage] = useState(1);

    // Active tab
    const [activeTab, setActiveTab] = useState('rfps');
    const [rfpTab, setRfpTab] = useState('recommended');
    const [grantTab, setGrantTab] = useState('recent');

    // Sidebar states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isGrantSidebarOpen, setIsGrantSidebarOpen] = useState(false);

    // Error handling
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [fetchedRFPs, setFetchedRFPs] = useState(false);
    const [fetchedGrants, setFetchedGrants] = useState(false);

    const navigate = useNavigate();
    const { role } = useUser();

    // Utility functions
    const getCurrentPageItems = (items, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const getTotalPages = (totalItems, itemsPerPage) => {
        return Math.ceil(totalItems / itemsPerPage);
    };

    const handlePageChange = (page, setter) => {
        setter(page);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'rfps') {
            setRfpTab('recommended');
        } else if (tab === 'grants') {
            setGrantTab('recent');
        }
    };

    // API functions
    const fetchOtherRFPs = async () => {
        try {
            setLoadingOtherRFPs(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/getOtherRFPs`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setOtherRFPs(response.data.data);
                setOriginalOtherRFPs(response.data.data);
                setFetchedRFPs(true);
            }
        } catch (error) {
            console.error('Error fetching other RFPs:', error);
            setError('Failed to fetch RFPs');
        } finally {
            setLoadingOtherRFPs(false);
        }
    };

    const fetchRFPs = async () => {
        try {
            setLoadingRecommended(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/getRecommendedRFPs`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setRecommended(response.data.data);
                setOriginalRecommended(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recommended RFPs:', error);
            setError('Failed to fetch recommended RFPs');
        } finally {
            setLoadingRecommended(false);
        }
    };

    const fetchGrants = async () => {
        try {
            setLoadingRecentGrants(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/getRecentGrants`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setRecentGrants(response.data.data);
                setOriginalRecentGrants(response.data.data);
                setFetchedGrants(true);
            }
        } catch (error) {
            console.error('Error fetching grants:', error);
            setError('Failed to fetch grants');
        } finally {
            setLoadingRecentGrants(false);
        }
    };

    // Event handlers
    const handleGenerateProposal = (item) => {
        if (activeTab === 'grants') {
            setSelectedGrant(item);
            setShowGrantProposalModal(true);
        } else {
            navigate('/proposal_page', { state: { proposal: item } });
        }
    };

    const handleSaveRFP = async (rfpId) => {
        try {
            setLoadingSave(prev => ({ ...prev, [rfpId]: true }));

            const response = await axios.post(`${API_BASE_URL}/saveRFP`,
                { rfpId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                Swal.fire('Success', 'RFP saved successfully', 'success');
                // Update saved state
                setSaved(prev => [...prev, response.data.data]);
            }
        } catch (error) {
            console.error('Error saving RFP:', error);
            Swal.fire('Error', 'Failed to save RFP', 'error');
        } finally {
            setLoadingSave(prev => ({ ...prev, [rfpId]: false }));
        }
    };

    const handleSaveGrant = async (grantId) => {
        try {
            setLoadingSaveGrant(prev => ({ ...prev, [grantId]: true }));

            const response = await axios.post(`${API_BASE_URL}/saveGrant`,
                { grantId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                Swal.fire('Success', 'Grant saved successfully', 'success');
                setSavedGrants(prev => [...prev, response.data.data]);
            }
        } catch (error) {
            console.error('Error saving grant:', error);
            Swal.fire('Error', 'Failed to save grant', 'error');
        } finally {
            setLoadingSaveGrant(prev => ({ ...prev, [grantId]: false }));
        }
    };

    // Effects
    useEffect(() => {
        fetchRFPs();
        fetchGrants();
    }, []);

    // Memoized filtered data
    const filteredRecommended = useMemo(() => {
        if (!searchQuery && filters.category.length === 0 && filters.deadline.length === 0) {
            return recommended;
        }

        return recommended.filter(rfp => {
            const matchesSearch = !searchQuery ||
                rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rfp.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = filters.category.length === 0 ||
                filters.category.includes(rfp.category);

            const matchesDeadline = filters.deadline.length === 0 ||
                filters.deadline.some(deadline => {
                    // Add deadline filtering logic here
                    return true;
                });

            return matchesSearch && matchesCategory && matchesDeadline;
        });
    }, [recommended, searchQuery, filters]);

    const filteredRecentGrants = useMemo(() => {
        if (!searchQuery && Object.values(grantFilters).every(arr => arr.length === 0)) {
            return recentGrants;
        }

        return recentGrants.filter(grant => {
            const matchesSearch = !searchQuery ||
                grant.OPPORTUNITY_TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
                grant.FUNDING_DESCRIPTION?.toLowerCase().includes(searchQuery.toLowerCase());

            // Add grant-specific filtering logic here
            return matchesSearch;
        });
    }, [recentGrants, searchQuery, grantFilters]);

    // Get current page data
    const currentRecommendedItems = getCurrentPageItems(filteredRecommended, currentTablePage, itemsPerPage);
    const currentRecentGrantItems = getCurrentPageItems(filteredRecentGrants, currentGrantTablePage, itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />

            <main className="pt-20 px-4 md:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Opportunities</h1>
                    <p className="text-gray-600">Find and manage RFPs and grants that match your business</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search opportunities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                RFP Filters
                            </button>
                            <button
                                onClick={() => setIsGrantSidebarOpen(!isGrantSidebarOpen)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Grant Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Industry Selection */}
                <div className="mb-6">
                    <IndustryMultiSelect
                        selectedIndustries={selectedIndustries}
                        onIndustryChange={setSelectedIndustries}
                        industries={availableIndustries}
                    />
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => handleTabChange('rfps')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'rfps'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                RFPs
                            </button>
                            <button
                                onClick={() => handleTabChange('grants')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'grants'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Grants
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'rfps' ? (
                    <div>
                        {/* RFP Sub-tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setRfpTab('recommended')}
                                    className={`px-4 py-2 rounded-lg font-medium ${rfpTab === 'recommended'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Recommended
                                </button>
                                <button
                                    onClick={() => setRfpTab('other')}
                                    className={`px-4 py-2 rounded-lg font-medium ${rfpTab === 'other'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Other RFPs
                                </button>
                                <button
                                    onClick={() => setRfpTab('saved')}
                                    className={`px-4 py-2 rounded-lg font-medium ${rfpTab === 'saved'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Saved
                                </button>
                            </div>
                        </div>

                        {/* RFP Content */}
                        {rfpTab === 'recommended' && (
                            <div>
                                {loadingRecommended ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                            {currentRecommendedItems.map((rfp) => (
                                                <RFPCard
                                                    key={rfp._id}
                                                    rfp={rfp}
                                                    isSaved={saved.some(s => s._id === rfp._id)}
                                                    handleGenerateProposal={handleGenerateProposal}
                                                    handleSaveRFP={handleSaveRFP}
                                                    loadingSave={loadingSave}
                                                />
                                            ))}
                                        </div>

                                        <Pagination
                                            currentPage={currentTablePage}
                                            totalPages={getTotalPages(filteredRecommended.length, itemsPerPage)}
                                            onPageChange={(page) => handlePageChange(page, setCurrentTablePage)}
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {/* Grant Sub-tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setGrantTab('recent')}
                                    className={`px-4 py-2 rounded-lg font-medium ${grantTab === 'recent'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Recent Grants
                                </button>
                                <button
                                    onClick={() => setGrantTab('other')}
                                    className={`px-4 py-2 rounded-lg font-medium ${grantTab === 'other'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Other Grants
                                </button>
                                <button
                                    onClick={() => setGrantTab('saved')}
                                    className={`px-4 py-2 rounded-lg font-medium ${grantTab === 'saved'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                        }`}
                                >
                                    Saved Grants
                                </button>
                            </div>
                        </div>

                        {/* Grant Content */}
                        {grantTab === 'recent' && (
                            <div>
                                {loadingRecentGrants ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                            {currentRecentGrantItems.map((grant) => (
                                                <GrantCard
                                                    key={grant._id}
                                                    grant={grant}
                                                    isSaved={savedGrants.some(s => s._id === grant._id)}
                                                    handleGenerateProposal={handleGenerateProposal}
                                                    handleSaveGrant={handleSaveGrant}
                                                    loadingSave={loadingSaveGrant}
                                                />
                                            ))}
                                        </div>

                                        <Pagination
                                            currentPage={currentGrantTablePage}
                                            totalPages={getTotalPages(filteredRecentGrants.length, itemsPerPage)}
                                            onPageChange={(page) => handlePageChange(page, setCurrentGrantTablePage)}
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Sidebars */}
                <LeftSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                />

                <GrantsFilterSidebar
                    isOpen={isGrantSidebarOpen}
                    onClose={() => setIsGrantSidebarOpen(false)}
                    grantFilters={grantFilters}
                    setGrantFilters={setGrantFilters}
                />

                {/* Grant Proposal Modal */}
                {showGrantProposalModal && selectedGrant && (
                    <GrantProposalForm
                        selectedGrant={selectedGrant}
                        isOpen={showGrantProposalModal}
                        onClose={() => {
                            setShowGrantProposalModal(false);
                            setSelectedGrant(null);
                        }}
                        isGenerating={isGeneratingGrantProposal}
                        onGenerate={() => {
                            setIsGeneratingGrantProposal(true);
                            // Handle grant proposal generation
                            setTimeout(() => {
                                setIsGeneratingGrantProposal(false);
                                setShowGrantProposalModal(false);
                                setSelectedGrant(null);
                            }, 2000);
                        }}
                    />
                )}
            </main>
        </div>
    );
};

export default DiscoverRefactored;
