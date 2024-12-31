import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useInactivityLogout = () => {
  const router = useRouter();
  const TIMEOUT = 0.5 * 60 * 1000; // 30 minutes

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      console.log('Timer reset - setting new timeout');
      timeoutId = setTimeout(() => {
        console.log('Inactivity timeout reached - logging out');
        localStorage.removeItem('access_token');
        router.push('/');
      }, TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [router]);
}; 