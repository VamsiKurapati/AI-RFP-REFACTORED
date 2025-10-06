// Dashboard constants and utility functions

export const statusStyles = {
    "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
    "Won": "bg-[#FEF9C3] text-[#CA8A04]",
    "Submitted": "bg-[#DCFCE7] text-[#15803D]",
    "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
    "Posted": "bg-[#DBEAFE] text-[#2563EB]",
    "Forecasted": "bg-[#FEF3C7] text-[#F59E42]",
    "Closed": "bg-[#FEE2E2] text-[#DC2626]",
    "Archived": "bg-[#F3F4F6] text-[#6B7280]",
};

// Helper: bg color map for calendar
export const bgColor = {
    'In Progress': 'bg-[#DBEAFE] bg-opacity-50',
    'Submitted': 'bg-[#DCFCE7] bg-opacity-50',
    'Won': 'bg-[#FEF9C3] bg-opacity-50',
    'Rejected': 'bg-[#FEE2E2] bg-opacity-50',
    'Deadline': 'bg-[#FEF3C7] bg-opacity-50',
    'Posted': 'bg-[#DBEAFE] bg-opacity-50',
    'Forecasted': 'bg-[#FEF3C7] bg-opacity-50',
    'Closed': 'bg-[#FEE2E2] bg-opacity-50',
    'Archived': 'bg-[#F3F4F6] bg-opacity-50',
};

// Helper: status color map for bg and text, dot
export const statusBgMap = {
    'In Progress': 'bg-[#DBEAFE] text-[#2563EB]',
    'Submitted': 'bg-[#DCFCE7] text-[#16A34A]',
    'Won': 'bg-[#FEF9C3] text-[#CA8A04]',
    'Rejected': 'bg-[#FEE2E2] text-[#DC2626]',
    'Deadline': 'bg-[#FEF3C7] text-[#F59E42]',
    'Posted': 'bg-[#DBEAFE] text-[#2563EB]',
    'Forecasted': 'bg-[#FEF3C7] text-[#F59E42]',
    'Closed': 'bg-[#FEE2E2] text-[#DC2626]',
    'Archived': 'bg-[#F3F4F6] text-[#6B7280]',
};

export const statusDotMap = {
    'In Progress': 'bg-[#2563EB]',
    'Submitted': 'bg-[#16A34A]',
    'Won': 'bg-[#CA8A04]',
    'Rejected': 'bg-[#DC2626]',
    'Deadline': 'bg-[#F59E42]',
    'Posted': 'bg-[#2563EB]',
    'Forecasted': 'bg-[#F59E42]',
    'Closed': 'bg-[#DC2626]',
    'Archived': 'bg-[#6B7280]',
};

export const getSummaryCardBgColor = (label) => {
    switch (label) {
        case "All Proposals":
            return "linear-gradient(180deg, #EFF6FF 0%, #99B9FF 100%)";
        case "In Progress":
            return "linear-gradient(180deg, #EEF2FF 0%, #C1BDFF 100%)";
        case "Submitted":
            return "linear-gradient(180deg, #F0FDF4 0%, #A0FFC3 100%)";
        case "Won":
            return "linear-gradient(180deg, #FEFCE8 0%, #FFD171 100%)";
        default:
            return "linear-gradient(180deg, #F3F4F6 0%, #F3F4F6 100%)";
    }
};

export const getSummaryCardTextColor = (label) => {
    switch (label) {
        case "All Proposals":
            return "#2563EB";
        case "In Progress":
            return "#4F46E5";
        case "Submitted":
            return "#16A34A";
        case "Won":
            return "#CA8A04";
        default:
            return "#000000";
    }
};

export const PAGE_SIZE = 5;
