import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSubscriptionPlans } from '../context/SubscriptionPlansContext';
import CheckoutForm from '../components/payment/CheckoutForm';
import PaymentSummary from '../components/payment/PaymentSummary';
import { STRIPE_CONFIG } from '../config/stripe';
import Swal from 'sweetalert2';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);

const StripePaymentPageRefactored = () => {
    const navigate = useNavigate();
    const { subscriptionPlans, loading: plansLoading } = useSubscriptionPlans();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [paymentStep, setPaymentStep] = useState('plan-selection'); // 'plan-selection' or 'payment'

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Check if a plan was pre-selected from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const planId = urlParams.get('planId');
        const cycle = urlParams.get('cycle');

        if (planId && subscriptionPlans.length > 0) {
            const plan = subscriptionPlans.find(p => p._id === planId);
            if (plan) {
                setSelectedPlan(plan);
                setBillingCycle(cycle || 'monthly');
                setPaymentStep('payment');
            }
        }
    }, [navigate, subscriptionPlans]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setPaymentStep('payment');
    };

    const handleBackToPlans = () => {
        setPaymentStep('plan-selection');
        setSelectedPlan(null);
    };

    const handlePaymentSuccess = (paymentIntent) => {
        console.log('Payment successful:', paymentIntent);

        // Redirect to dashboard or success page
        Swal.fire({
            title: 'Payment Successful!',
            text: 'Your subscription has been activated. Redirecting to dashboard...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            navigate('/dashboard');
        });
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);

        Swal.fire({
            title: 'Payment Failed',
            text: 'There was an error processing your payment. Please try again.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
        });
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Cancel Payment?',
            text: 'Are you sure you want to cancel this payment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel',
            cancelButtonText: 'No, continue'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/dashboard');
            }
        });
    };

    if (plansLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h2>
                    <p className="text-gray-600 mb-6">Subscription plans are not available at the moment.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Subscription Payment</h1>
                        </div>

                        {paymentStep === 'payment' && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {paymentStep === 'plan-selection' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                            <p className="text-gray-600">Select a subscription plan that fits your needs</p>
                        </div>

                        {/* Billing Cycle Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-2 rounded-md transition-colors ${billingCycle === 'monthly'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-2 rounded-md transition-colors ${billingCycle === 'yearly'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Yearly (20% off)
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subscriptionPlans.map((plan) => (
                                <div
                                    key={plan._id}
                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handlePlanSelect(plan)}
                                >
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold text-blue-600 mb-4">
                                            ${plan.price}
                                            <span className="text-sm text-gray-500 font-normal">
                                                /{billingCycle === 'yearly' ? 'year' : 'month'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-6">{plan.description}</p>

                                        <div className="space-y-2 mb-6">
                                            {plan.features?.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            Select Plan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Payment Form */}
                            <div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            selectedPlan={selectedPlan}
                                            billingCycle={billingCycle}
                                            onSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                        />
                                    </Elements>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div>
                                <PaymentSummary
                                    selectedPlan={selectedPlan}
                                    billingCycle={billingCycle}
                                    onBack={handleBackToPlans}
                                    onCancel={handleCancel}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StripePaymentPageRefactored;
