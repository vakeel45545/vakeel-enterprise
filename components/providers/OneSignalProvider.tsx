'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      const initOneSignal = async () => {
        try {
          // Replace with your actual OneSignal App ID
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: true,
              prenotify: true,
              size: 'medium',
              position: 'bottom-right',
              showCredit: false,
              text: {
                'dialog.main.title': 'Manage Notifications',
                'dialog.main.button.subscribe': 'SUBSCRIBE',
                'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
                'dialog.blocked.title': 'Notifications Blocked',
                'dialog.blocked.message': 'Please enable notifications in your browser settings.',
                'message.prenotify': 'Click to subscribe to notifications',
                'message.action.subscribing': 'Subscribing...',
                'message.action.subscribed': 'You are subscribed to notifications',
                'message.action.resubscribed': 'You are subscribed to notifications',
                'message.action.unsubscribed': 'You are unsubscribed from notifications',
                'tip.state.subscribed': 'You are subscribed to notifications',
                'tip.state.unsubscribed': 'Subscribe to notifications',
                'tip.state.blocked': 'You have blocked notifications',
              }
            },
          });
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing OneSignal:', error);
        }
      };

      initOneSignal();
    }
  }, []);

  return <>{children}</>;
}
