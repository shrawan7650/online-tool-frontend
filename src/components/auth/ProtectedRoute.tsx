import React,{ ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { SubscriptionModal } from './SubscriptionModal';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresPro?: boolean;
  requiresMaxPro?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiresPro = false, 
  requiresMaxPro = false 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  // If no authentication required, render children
  if (!requiresPro && !requiresMaxPro) {
    return <>{children}</>;
  }

  // If not authenticated, show subscription modal with login prompt
  if (!isAuthenticated || !user) {
    return (
      <SubscriptionModal
        isOpen={true}
        onClose={() => {}}
        requiresLogin={true}
        requiredPlan={requiresMaxPro ? 'maxpro' : 'pro'}
      />
    );
  }

  // Check Max Pro requirement
  if (requiresMaxPro && !user.isMaxPro) {
    return (
      <SubscriptionModal
        isOpen={true}
        onClose={() => {}}
        requiredPlan="maxpro"
      />
    );
  }

  // Check Pro requirement
  if (requiresPro && !user.isPro && !user.isMaxPro) {
    return (
      <SubscriptionModal
        isOpen={true}
        onClose={() => {}}
        requiredPlan="pro"
      />
    );
  }

  // Check if subscription is expired
  if ((user.isPro || user.isMaxPro) && user.subscriptionExpiry) {
    const expiryDate = new Date(user.subscriptionExpiry);
    const now = new Date();
    
    if (expiryDate < now && user.subscriptionStatus !== 'active') {
      return (
        <SubscriptionModal
          isOpen={true}
          onClose={() => {}}
          requiredPlan={user.isMaxPro ? 'maxpro' : 'pro'}
          isExpired={true}
        />
      );
    }
  }

  return <>{children}</>;
}