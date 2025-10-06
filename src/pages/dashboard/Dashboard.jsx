import React, { useState, useEffect, useCallback } from 'react';
import NavbarComponent from '../../components/layout/NavbarComponent';
import { useUser } from '../../context/UserContext';
import Swal from 'sweetalert2';
import PaymentButton from '../../components/ui/PaymentButton';

// Import dashboard components
import SummaryCards from '../../components/dashboard/SummaryCards';
import CalendarComponent from '../../components/dashboard/Calendar';
import ProposalsTable from '../../components/dashboard/ProposalsTable';
import GrantProposalsTable from '../../components/dashboard/GrantProposalsTable';
import DeletedProposalsTable from '../../components/dashboard/DeletedProposalsTable';
import { PAGE_SIZE } from '../../components/dashboard/constants';

const DashboardRefactored = () => {
    const { role, userName } = useUser();

    // State management
    const [proposals, setProposals] = useState([]);
    const [grantProposals, setGrantProposals] = useState([]);
    const [deletedProposals, setDeletedProposals] = useState([]);
    const [deletedGrantProposals, setDeletedGrantProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [currentProposalPage, setCurrentProposalPage] = useState(1);
    const [currentGrantPage, setCurrentGrantPage] = useState(1);
    const [currentDeletedPage, setCurrentDeletedPage] = useState(1);
    const [currentDeletedGrantPage, setCurrentDeletedGrantPage] = useState(1);

    // Selection states
    const [selectedProposals, setSelectedProposals] = useState([]);
    const [selectedGrantProposals, setSelectedGrantProposals] = useState([]);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [showGrantDeleteOptions, setShowGrantDeleteOptions] = useState(false);

    // Editing states
    const [editingProposal, setEditingProposal] = useState(null);
    const [editingGrantProposal, setEditingGrantProposal] = useState(null);
    const [currentEditor, setCurrentEditor] = useState({});
    const [currentGrantEditor, setCurrentGrantEditor] = useState({});

    // Loading states
    const [deletingProposal, setDeletingProposal] = useState({});
    const [deletingGrantProposal, setDeletingGrantProposal] = useState({});
    const [deletingPermanently, setDeletingPermanently] = useState({});
    const [deletingGrantPermanently, setDeletingGrantPermanently] = useState({});
    const [restoringProposal, setRestoringProposal] = useState({});
    const [restoringGrantProposal, setRestoringGrantProposal] = useState({});

    // Calendar states
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    // Calculate summary data
    const summaryData = [
        {
            label: "All Proposals",
            count: proposals.length + grantProposals.length,
            icon: "📋"
        },
        {
            label: "In Progress",
            count: [...proposals, ...grantProposals].filter(p => p.status === "In Progress").length,
            icon: "🔄"
        },
        {
            label: "Submitted",
            count: [...proposals, ...grantProposals].filter(p => p.status === "Submitted").length,
            icon: "✅"
        },
        {
            label: "Won",
            count: [...proposals, ...grantProposals].filter(p => p.status === "Won").length,
            icon: "🏆"
        }
    ];

    // Calculate pagination
    const totalProposalPages = Math.ceil(proposals.length / PAGE_SIZE);
    const totalGrantPages = Math.ceil(grantProposals.length / PAGE_SIZE);
    const totalDeletedPages = Math.ceil(deletedProposals.length / PAGE_SIZE);
    const totalDeletedGrantPages = Math.ceil(deletedGrantProposals.length / PAGE_SIZE);

    // Calendar events
    const calendarEvents = [
        ...proposals.map(p => ({
            id: p.id,
            title: p.title,
            start: new Date(p.deadline),
            end: new Date(p.deadline),
            status: p.status
        })),
        ...grantProposals.map(p => ({
            id: p.id,
            title: p.OPPORTUNITY_TITLE || 'Grant Proposal',
            start: new Date(p.CLOSE_DATE || p.deadline),
            end: new Date(p.CLOSE_DATE || p.deadline),
            status: p.OPPORTUNITY_STATUS || p.status
        }))
    ];

    // Event handlers
    const handleEditClick = (idx, proposal) => {
        setEditingProposal(idx);
        if (proposal) {
            setCurrentEditor(prev => ({ ...prev, [idx]: proposal.currentEditor }));
        }
    };

    const handleEditChange = (field, value) => {
        // Handle edit changes
        console.log('Edit change:', field, value);
    };

    const handleSaveProposal = async (proposalId) => {
        // Handle save proposal
        console.log('Save proposal:', proposalId);
        setEditingProposal(null);
    };

    const handleEditGrantClick = (idx, proposal) => {
        setEditingGrantProposal(idx);
        if (proposal) {
            setCurrentGrantEditor(prev => ({ ...prev, [idx]: proposal.currentEditor }));
        }
    };

    const handleEditGrantChange = (field, value) => {
        // Handle grant edit changes
        console.log('Grant edit change:', field, value);
    };

    const handleSaveGrantProposal = async (proposalId) => {
        // Handle save grant proposal
        console.log('Save grant proposal:', proposalId);
        setEditingGrantProposal(null);
    };

    const handleSetCurrentEditor = async (idx, editorId) => {
        // Handle set current editor
        console.log('Set current editor:', idx, editorId);
    };

    const handleSetGrantCurrentEditor = async (idx, editorId) => {
        // Handle set grant current editor
        console.log('Set grant current editor:', idx, editorId);
    };

    const handleSelectProposal = (idx) => {
        setSelectedProposals(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx)
                : [...prev, idx]
        );
    };

    const handleSelectGrantProposal = (idx) => {
        setSelectedGrantProposals(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx)
                : [...prev, idx]
        );
    };

    const handleDeleteProposals = async () => {
        // Handle delete proposals
        console.log('Delete proposals:', selectedProposals);
    };

    const handleDeleteGrantProposals = async () => {
        // Handle delete grant proposals
        console.log('Delete grant proposals:', selectedGrantProposals);
    };

    const handleRestoreProposal = async (idx) => {
        // Handle restore proposal
        console.log('Restore proposal:', idx);
    };

    const handleRestoreGrantProposal = async (idx) => {
        // Handle restore grant proposal
        console.log('Restore grant proposal:', idx);
    };

    const handleDeletePermanently = async (idx) => {
        // Handle delete permanently
        console.log('Delete permanently:', idx);
    };

    const handleDeleteGrantPermanently = async (idx) => {
        // Handle delete grant permanently
        console.log('Delete grant permanently:', idx);
    };

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch data from API
            // This would be replaced with actual API calls
            console.log('Fetching dashboard data...');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            Swal.fire('Error', 'Failed to fetch dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <NavbarComponent />
            <main className="w-full mx-auto py-8 px-4 md:px-12 mt-20">
                {/* Welcome Section */}
                <div className="rounded-lg p-6 mb-6" style={{ background: "url('/dashboard-bg.png') no-repeat center center", backgroundSize: "cover" }}>
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-[36px] text-[#000000] mb-4">Welcome <span className="font-semibold">{userName}</span>!</h1>
                            <p className="text-[18px] text-[#4B5563] mb-6">Manage your proposals and track your progress</p>
                        </div>
                        <PaymentButton />
                    </div>
                </div>

                {/* Summary Cards */}
                <SummaryCards summaryData={summaryData} />

                {/* Calendar */}
                <CalendarComponent
                    events={calendarEvents}
                    onNavigate={setDate}
                    date={date}
                    view={view}
                    onView={setView}
                />

                {/* Proposals Table */}
                <ProposalsTable
                    proposals={proposals}
                    currentPage={currentProposalPage}
                    setCurrentPage={setCurrentProposalPage}
                    totalPages={totalProposalPages}
                    selectedProposals={selectedProposals}
                    showDeleteOptions={showDeleteOptions}
                    editingProposal={editingProposal}
                    deletingProposal={deletingProposal}
                    deletingPermanently={deletingPermanently}
                    currentEditor={currentEditor}
                    setCurrentEditor={setCurrentEditor}
                    onSelectProposal={handleSelectProposal}
                    onEditClick={handleEditClick}
                    onEditChange={handleEditChange}
                    onSaveProposal={handleSaveProposal}
                    onSetCurrentEditor={handleSetCurrentEditor}
                    onDeleteProposals={handleDeleteProposals}
                    onDeletePermanently={handleDeletePermanently}
                    onRestoreProposal={handleRestoreProposal}
                    role={role}
                />

                {/* Grant Proposals Table */}
                <GrantProposalsTable
                    grantProposals={grantProposals}
                    currentGrantPage={currentGrantPage}
                    setCurrentGrantPage={setCurrentGrantPage}
                    totalGrantPages={totalGrantPages}
                    selectedGrantProposals={selectedGrantProposals}
                    showGrantDeleteOptions={showGrantDeleteOptions}
                    editingGrantProposal={editingGrantProposal}
                    deletingGrantProposal={deletingGrantProposal}
                    deletingGrantPermanently={deletingGrantPermanently}
                    currentGrantEditor={currentGrantEditor}
                    setCurrentGrantEditor={setCurrentGrantEditor}
                    onSelectGrantProposal={handleSelectGrantProposal}
                    onEditGrantClick={handleEditGrantClick}
                    onEditGrantChange={handleEditGrantChange}
                    onSaveGrantProposal={handleSaveGrantProposal}
                    onSetGrantCurrentEditor={handleSetGrantCurrentEditor}
                    onDeleteGrantProposals={handleDeleteGrantProposals}
                    onDeleteGrantPermanently={handleDeleteGrantPermanently}
                    onRestoreGrantProposal={handleRestoreGrantProposal}
                    role={role}
                />

                {/* Deleted Proposals Table */}
                <DeletedProposalsTable
                    deletedProposals={deletedProposals}
                    currentDeletedPage={currentDeletedPage}
                    setCurrentDeletedPage={setCurrentDeletedPage}
                    totalDeletedPages={totalDeletedPages}
                    restoringProposal={restoringProposal}
                    deletingPermanently={deletingPermanently}
                    onRestoreProposal={handleRestoreProposal}
                    onDeletePermanently={handleDeletePermanently}
                />

                {/* Deleted Grant Proposals Table */}
                <DeletedProposalsTable
                    deletedProposals={deletedGrantProposals}
                    currentDeletedPage={currentDeletedGrantPage}
                    setCurrentDeletedPage={setCurrentDeletedGrantPage}
                    totalDeletedPages={totalDeletedGrantPages}
                    restoringProposal={restoringGrantProposal}
                    deletingPermanently={deletingGrantPermanently}
                    onRestoreProposal={handleRestoreGrantProposal}
                    onDeletePermanently={handleDeleteGrantPermanently}
                    isGrantProposals={true}
                />
            </main>
        </div>
    );
};

export default DashboardRefactored;
