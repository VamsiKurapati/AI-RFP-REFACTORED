import React from 'react';
import { FaCheck, FaArrowLeft, FaBan } from 'react-icons/fa';
import { MdOutlinePayments, MdOutlineSecurity, MdOutlineSupport } from 'react-icons/md';

const PaymentSummary = ({ selectedPlan, billingCycle, onBack, onCancel }) => {
    if (!selectedPlan) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBan className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plan Selected</h3>
                    <p className="text-gray-600 mb-6">Please select a subscription plan to continue.</p>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Plans
                    </button>
                </div>
            </div>
        );
    }

    const calculatePrice = () => {
        if (!selectedPlan) return 0;

        const basePrice = selectedPlan.price || 0;
        const discount = billingCycle === 'yearly' ? 0.2 : 0; // 20% discount for yearly
        return basePrice * (1 - discount);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const originalPrice = selectedPlan?.price || 0;
    const discountedPrice = calculatePrice();
    const savings = originalPrice - discountedPrice;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Cancel payment"
                >
                    <FaBan className="w-5 h-5" />
                </button>
            </div>

            {/* Plan Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.name}</h3>
                        <p className="text-gray-600">{selectedPlan.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(discountedPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                            per {billingCycle === 'yearly' ? 'year' : 'month'}
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                    {selectedPlan.features?.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <FaCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Plan Price</span>
                    <span className="text-gray-900">{formatPrice(originalPrice)}</span>
                </div>

                {billingCycle === 'yearly' && savings > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Yearly Discount (20%)</span>
                        <span>-{formatPrice(savings)}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle</span>
                    <span className="text-gray-900 capitalize">{billingCycle}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-blue-600">{formatPrice(discountedPrice)}</span>
                    </div>
                </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MdOutlineSecurity className="w-5 h-5 mr-2 text-blue-600" />
                    Secure Payment
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FaCheck className="w-3 h-3 text-green-600" />
                        <span>SSL encrypted connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheck className="w-3 h-3 text-green-600" />
                        <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheck className="w-3 h-3 text-green-600" />
                        <span>Stripe secure processing</span>
                    </div>
                </div>
            </div>

            {/* Support Info */}
            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                    <MdOutlineSupport className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Need Help?</span>
                </div>
                <p className="text-blue-700 text-sm">
                    Contact our support team if you have any questions about your subscription.
                </p>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    Back to Plans
                </button>
            </div>
        </div>
    );
};

export default PaymentSummary;
