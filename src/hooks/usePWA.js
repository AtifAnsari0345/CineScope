import { useState, useEffect, useCallback } from 'react';

// Persist the native event across hook lifecycles
let deferredPrompt = null;
let isPromptReady = false;

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === 'undefined') return isPromptReady;
    return isPromptReady || localStorage.getItem('pwa_can_install_v3') === 'true';
  });
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  const checkStandalone = useCallback(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
    setIsStandalone(standalone);
    return standalone;
  }, []);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOSDevice(ios);

    if (checkStandalone()) {
      setIsInstallable(false);
      return;
    }

    // Capture the native event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt captured ✅');
      e.preventDefault();
      deferredPrompt = e;
      isPromptReady = true;
      setIsInstallable(true);
      localStorage.setItem('pwa_can_install_v3', 'true');
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully 🎉');
      setIsInstallable(false);
      isPromptReady = false;
      deferredPrompt = null;
      setIsInstalling(false);
      localStorage.removeItem('pwa_can_install_v3');
    };

    // Persistence check: If we think it's installable, show it
    if (localStorage.getItem('pwa_can_install_v3') === 'true' && !checkStandalone()) {
      setIsInstallable(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Some browsers might have already fired it
    if (window.deferredPrompt) {
      handleBeforeInstallPrompt(window.deferredPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkStandalone]);

  const installApp = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      alert('To install CineScope on iOS:\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm.');
      return;
    }

    if (!deferredPrompt) {
      console.warn('PWA: deferredPrompt is missing');
      alert('Installation prompt is not available yet. On Android, use Chrome menu → "Install app" or "Add to Home screen".');
      return;
    }

    try {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: User choice outcome: ${outcome}`);
      
      if (outcome === 'accepted') {
        deferredPrompt = null;
        isPromptReady = false;
        setIsInstallable(false);
        localStorage.removeItem('pwa_can_install_v3');
      }
    } catch (err) {
      console.error('PWA: Error during installation:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  return { isInstallable, isStandalone, isInstalling, isIOSDevice, installApp };
};
