import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const categories = [
    "Billing & Payments",
    "Proposal Issues",
    "Account & Access",
    "Technical Errors",
    "Feature Requests",
    "Others",
];

const subCategoriesMap = {
    "Billing & Payments": [
        "Payment Failure",
        "Refund Request",
        "Invoice Issue",
        "Pricing Inquiry",
        "Subscription Cancellation",
        "Failed Transaction",
    ],
    "Proposal Issues": ["Proposal Formatting", "Template Issues"],
    "Account & Access": [
        "Password Reset",
        "Account Deletion",
        "Profile Update",
        "Account Recovery",
    ],
    "Technical Errors": [
        "Edit Option-profile edit",
        "Page Loading Issue",
        "Form Submission Error",
        "Broken Link",
        "Performance Issues",
        "Browser Compatibility",
        "File Upload/Download Problems",
    ],
    "Feature Requests": [
        "Upload/Export issue",
        "Unable to use Feature according to the subscribed plan",
        "UI/UX Improvements",
    ],
    Others: ["General Inquiry", "Request Documentation", "Training Request"],
};

const SupportTicketForm = ({ onSubmit, loading }) => {
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            category,
            subCategory,
            subject,
            description,
            priority,
        });
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
        setSubCategory(""); // Reset subcategory when category changes
        setIsSubCategoryOpen(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Support Ticket</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryChange(cat)}
                                className={`p-3 text-sm rounded-lg border transition-colors ${category === cat
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subcategory Selection */}
                {category && subCategoriesMap[category] && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subcategory
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
                                className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between"
                            >
                                <span className={subCategory ? "text-gray-900" : "text-gray-500"}>
                                    {subCategory || "Select subcategory"}
                                </span>
                                {isSubCategoryOpen ? (
                                    <FaChevronUp className="w-4 h-4" />
                                ) : (
                                    <FaChevronDown className="w-4 h-4" />
                                )}
                            </button>

                            {isSubCategoryOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {subCategoriesMap[category].map((subCat) => (
                                        <button
                                            key={subCat}
                                            type="button"
                                            onClick={() => {
                                                setSubCategory(subCat);
                                                setIsSubCategoryOpen(false);
                                            }}
                                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            {subCat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description of your issue"
                        required
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Please provide detailed information about your issue..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !category || !subject || !description}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Creating Ticket..." : "Create Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupportTicketForm;
