import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaCheck, FaCreditCard, FaShieldAlt, FaLock } from 'react-icons/fa';
import { STRIPE_CONFIG, CARD_ELEMENT_OPTIONS, getStripeErrorMessage, getStripeConfigStatus, handleStripeError } from '../../config/stripe';
import axios from 'axios';
import Swal from 'sweetalert2';

const CheckoutForm = ({ selectedPlan, billingCycle, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    // Get Stripe configuration status
    const stripeConfig = getStripeConfigStatus();

    useEffect(() => {
        // Create payment intent on the server
        const createPaymentIntent = async () => {
            if (!selectedPlan || !selectedPlan._id) {
                setError('No plan selected. Please select a plan first.');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please log in again.');
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/stripe${STRIPE_CONFIG.API_ENDPOINTS.CREATE_PAYMENT_INTENT}`,
                    {
                        planId: selectedPlan._id,
                        billingCycle: billingCycle,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.success) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError(response.data.message || 'Failed to create payment intent');
                }
            } catch (error) {
                console.error('Error creating payment intent:', error);
                const errorMessage = handleStripeError(error);
                setError(errorMessage);
            }
        };

        createPaymentIntent();
    }, [selectedPlan, billingCycle]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe is not loaded yet. Please try again.');
            return;
        }

        if (!clientSecret) {
            setError('Payment intent not ready. Please try again.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (stripeError) {
                const errorMessage = getStripeErrorMessage(stripeError);
                setError(errorMessage);
                onError && onError(stripeError);
            } else if (paymentIntent.status === 'succeeded') {
                // Payment succeeded
                onSuccess && onSuccess(paymentIntent);

                Swal.fire({
                    title: 'Payment Successful!',
                    text: 'Your subscription has been activated.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Payment error:', error);
            const errorMessage = handleStripeError(error);
            setError(errorMessage);
            onError && onError(error);
        } finally {
            setLoading(false);
        }
    };

    // Show error if Stripe is not configured
    if (!stripeConfig.isConfigured) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <FaShieldAlt className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-800">Payment System Not Configured</h3>
                </div>
                <p className="text-red-700 mb-4">
                    {stripeConfig.message}
                </p>
                <div className="text-sm text-red-600">
                    Please contact support for assistance.
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Security Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                    <FaShieldAlt className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Secure Payment</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                    <FaLock className="w-4 h-4 mr-1" />
                    <span>Your payment information is encrypted and secure</span>
                </div>
            </div>

            {/* Card Element */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCreditCard className="w-4 h-4 inline mr-2" />
                    Card Information
                </label>
                <div className="border border-gray-300 rounded-lg p-3 bg-white">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-red-600 text-xs">!</span>
                        </div>
                        <span className="text-red-800 font-medium">Payment Error</span>
                    </div>
                    <p className="text-red-700 mt-1">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || !elements || loading || !clientSecret}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <FaCheck className="w-5 h-5 mr-2" />
                        Complete Payment - ${selectedPlan?.price || 0}
                    </>
                )}
            </button>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-500">
                <p>By completing this payment, you agree to our terms of service.</p>
                <p>Your subscription will be activated immediately upon successful payment.</p>
            </div>
        </form>
    );
};

export default CheckoutForm;
