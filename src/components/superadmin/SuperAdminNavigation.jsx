import React from 'react';
import {
    MdOutlinePerson,
    MdOutlineManageAccounts,
    MdOutlinePayments,
    MdOutlineHeadsetMic,
    MdOutlineNotifications,
    MdOutlineMenu,
    MdOutlineClose,
    MdOutlineLogout
} from 'react-icons/md';

const SuperAdminNavigation = ({
    activeTab,
    setActiveTab,
    showMobileMenu,
    setShowMobileMenu,
    onLogout
}) => {
    const navItems = [
        { id: 'user-management', label: 'User Management', icon: MdOutlinePerson },
        { id: 'plan-management', label: 'Plan Management', icon: MdOutlineManageAccounts },
        { id: 'payments', label: 'Payments', icon: MdOutlinePayments },
        { id: 'support', label: 'Support', icon: MdOutlineHeadsetMic },
        { id: 'notifications', label: 'Notifications', icon: MdOutlineNotifications },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden">
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                    {showMobileMenu ? (
                        <MdOutlineClose className="h-6 w-6" />
                    ) : (
                        <MdOutlineMenu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Icon className="mr-2 h-5 w-5" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Mobile Navigation */}
            {showMobileMenu && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setShowMobileMenu(false);
                                    }}
                                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${activeTab === item.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                        <button
                            onClick={onLogout}
                            className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                            <MdOutlineLogout className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SuperAdminNavigation;
