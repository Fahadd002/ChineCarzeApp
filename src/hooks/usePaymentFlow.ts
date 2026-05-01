import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/services/payment.services';
import { createSubscriptionCheckoutSession } from '@/services/payment.services';
import { ICheckoutSessionPayload } from '@/types/payment.types';

export interface SubscriptionPlan {
  plan: string;
  price: number;
  duration: string;
}

export interface PaymentFlowUIProps {
  contentId: string;
  contentTitle: string;
  ticketPrice?: number;
  accessType: 'FREE' | 'SUBSCRIPTION' | 'TICKET' | 'BOTH';
  canAccess: boolean;
  subscriptionPlans: SubscriptionPlan[];
}

export function usePaymentFlow() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (type: 'TICKET' | 'SUBSCRIPTION', contentId?: string, plan?: string) => {
    setLoading(true);
    setError(null);

    try {
      let payload: ICheckoutSessionPayload;
      let serviceCall;

      if (type === 'TICKET') {
        if (!contentId) throw new Error('Content ID is required for ticket purchase');
        payload = { type, contentId };
        serviceCall = createCheckoutSession(payload);
      } else {
        if (!plan) throw new Error('Plan is required for subscription');
        payload = { type, plan: plan as any };
        serviceCall = createSubscriptionCheckoutSession(plan, 'SUBSCRIPTION_PURCHASE');
      }

      const response = await serviceCall;

      // Check if user is not authenticated
      if (response.status === 401 || (response.success === false && response.message?.includes('not authenticated'))) {
        setError('Please login to continue');
        setLoading(false);
        // Redirect to login page
        router.push('/login');
        return;
      }

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.message || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment.');
      setLoading(false);
    }
  }, [router]);

  const handleTicketPurchase = useCallback(async (contentId: string) => {
    await initiatePayment('TICKET', contentId);
  }, [initiatePayment]);

  const handleSubscriptionPurchase = useCallback(async (plan: string) => {
    await initiatePayment('SUBSCRIPTION', undefined, plan);
  }, [initiatePayment]);

  const handleRenewal = useCallback(async (plan: string) => {
    await initiatePayment('SUBSCRIPTION', undefined, plan);
  }, [initiatePayment]);

  return {
    loading,
    error,
    handleTicketPurchase,
    handleSubscriptionPurchase,
    handleRenewal,
    initiatePayment,
  };
}

export function PaymentFlowUI(props: PaymentFlowUIProps) {
  const { contentId, contentTitle, ticketPrice, accessType, canAccess, subscriptionPlans } = props;
  const { handleTicketPurchase, handleSubscriptionPurchase, loading, error } = usePaymentFlow();

  if (canAccess) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
        <p className="text-green-800 dark:text-green-200 font-medium">
          ✓ You have access to this content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {(accessType === 'TICKET' || accessType === 'BOTH') && ticketPrice && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold mb-2">One-Time Purchase</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Get lifetime access to this content with a one-time payment.
          </p>
          <button
            onClick={() => handleTicketPurchase(contentId)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Processing...' : `Buy Ticket - $${ticketPrice}`}
          </button>
        </div>
      )}

      {(accessType === 'SUBSCRIPTION' || accessType === 'BOTH') && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Subscription Plans</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Get access to all subscription content with a monthly or yearly plan.
          </p>
          <div className="space-y-2">
            {subscriptionPlans.map((p) => (
              <button
                key={p.plan}
                onClick={() => handleSubscriptionPurchase(p.plan)}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-6 py-3 w-full border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="flex justify-between items-center w-full">
                  <span>{p.plan.replace('_', ' ')}</span>
                  <span className="font-semibold">${p.price}/{p.duration}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}