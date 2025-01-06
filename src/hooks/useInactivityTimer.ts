import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export const useInactivityTimer = (timeout: number = 15) => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("agent");
      router.push("/");
      
      Swal.fire({
        title: 'Session Expired',
        text: 'You have been logged out due to inactivity.',
        icon: 'warning',
        timer: 4000,
        showConfirmButton: false,
      });
    };

    const resetTimer = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        if (inactiveTime > timeout * 60 * 1000) { // Convert minutes to milliseconds
          handleLogout();
        }
      }
    };

    const activities = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activities.forEach(activity => {
      document.addEventListener(activity, resetTimer);
    });

    resetTimer();

    const intervalId = setInterval(checkInactivity, 60000);

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, resetTimer);
      });
      clearInterval(intervalId);
    };
  }, [router, timeout]);
}; 