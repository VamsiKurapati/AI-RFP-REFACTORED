import React from 'react';
import {
    MdOutlineHome,
    MdOutlineGroups,
    MdOutlineDocumentScanner,
    MdOutlineFolder,
    MdOutlineAssignment,
    MdOutlineVerifiedUser,
    MdOutlinePayments
} from "react-icons/md";

// Unified Badge Styles
export const badgeStyles = {
    // Status badges
    "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
    "Won": "bg-[#DCFCE7] text-[#15803D]",
    "Submitted": "bg-[#DCFCE7] text-[#15803D]",
    "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
    "Urgent": "bg-[#FEE2E2] text-[#DC2626]",
    "Scheduled": "bg-[#DBEAFE] text-[#2563EB]",
    "On Track": "bg-[#DCFCE7] text-[#15803D]",
    "Pending": "bg-[#FEF9C3] text-[#CA8A04]",
    // Team member badges
    "Full Access": "bg-[#DBEAFE] text-[#2563EB]",
    "Admin": "bg-[#DCFCE7] text-[#15803D]",
    "Editor": "bg-[#FEF9C3] text-[#CA8A04]",
    "Viewer": "bg-[#F3F4F6] text-[#4B5563]",
};

// Sidebar items
export const sidebarItems = [
    { name: "Overview", icon: <MdOutlineHome className="w-6 h-6" /> },
    { name: "Team Details", icon: <MdOutlineGroups className="w-6 h-6" /> },
    { name: "Proposals", icon: <MdOutlineDocumentScanner className="w-6 h-6" /> },
    { name: "Documents", icon: <MdOutlineFolder className="w-6 h-6" /> },
    { name: "Case Studies", icon: <MdOutlineAssignment className="w-6 h-6" /> },
    { name: "Certificates", icon: <MdOutlineVerifiedUser className="w-6 h-6" /> },
    { name: "Payment", icon: <MdOutlinePayments className="w-6 h-6" /> },
];

// API endpoints
export const API_ENDPOINTS = {
    GET_COMPANY_PROFILE: `${import.meta.env.VITE_API_BASE_URL}/profile/getCompanyProfile`,
    UPDATE_COMPANY_PROFILE: `${import.meta.env.VITE_API_BASE_URL}/profile/updateCompanyProfile`,
    GET_TEAM_MEMBERS: `${import.meta.env.VITE_API_BASE_URL}/profile/getTeamMembers`,
    ADD_TEAM_MEMBER: `${import.meta.env.VITE_API_BASE_URL}/profile/addTeamMember`,
    UPDATE_TEAM_MEMBER: `${import.meta.env.VITE_API_BASE_URL}/profile/updateTeamMember`,
    DELETE_TEAM_MEMBER: `${import.meta.env.VITE_API_BASE_URL}/profile/deleteTeamMember`,
    GET_PROPOSALS: `${import.meta.env.VITE_API_BASE_URL}/proposals/getProposals`,
    GET_CASE_STUDIES: `${import.meta.env.VITE_API_BASE_URL}/profile/getCaseStudies`,
    ADD_CASE_STUDY: `${import.meta.env.VITE_API_BASE_URL}/profile/addCaseStudy`,
    UPDATE_CASE_STUDY: `${import.meta.env.VITE_API_BASE_URL}/profile/updateCaseStudy`,
    DELETE_CASE_STUDY: `${import.meta.env.VITE_API_BASE_URL}/profile/deleteCaseStudy`,
    GET_CERTIFICATES: `${import.meta.env.VITE_API_BASE_URL}/profile/getCertificates`,
    ADD_CERTIFICATE: `${import.meta.env.VITE_API_BASE_URL}/profile/addCertificate`,
    UPDATE_CERTIFICATE: `${import.meta.env.VITE_API_BASE_URL}/profile/updateCertificate`,
    DELETE_CERTIFICATE: `${import.meta.env.VITE_API_BASE_URL}/profile/deleteCertificate`,
    GET_DOCUMENTS: `${import.meta.env.VITE_API_BASE_URL}/profile/getDocuments`,
    UPLOAD_DOCUMENT: `${import.meta.env.VITE_API_BASE_URL}/profile/uploadDocument`,
    DELETE_DOCUMENT: `${import.meta.env.VITE_API_BASE_URL}/profile/deleteDocument`,
};

// Utility functions
export const formatDate = (date) => {
    if (!date) return "Not provided";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return dateObj.toLocaleDateString();
};

export const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};
