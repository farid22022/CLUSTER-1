// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api';


export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the backend logout endpoint (blacklist refresh token etc.)
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if backend fails → we still want to clear localStorage
      } finally {
        // Always clear auth data from browser
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Optional: clear any other auth-related items
        // localStorage.clear(); // ← only if you don't store anything else

        // Redirect to login (or home)
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  // Simple UI while logging out (very brief moment usually)
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2>Logging you out...</h2>
        <p>Please wait a moment</p>
        
        {/* Optional: nice spinner */}
        <div 
          style={{
            margin: '2rem auto',
            width: '40px',
            height: '40px',
            border: '5px solid #e2e8f0',
            borderTop: '5px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}