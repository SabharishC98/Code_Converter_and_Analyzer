import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { logout as logoutAPI } from '../services/authService.js';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch {
      // ignore API error, still log out locally
    }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid var(--color-border-tertiary)',
      background: 'var(--color-background-primary)',
      flexShrink: 0,
    }}>
      {/* Left: logo + nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ fontSize: '15px', fontWeight: '500', color: '#5B4FD9' }}>
          Code Translator
        </span>
        <nav style={{ display: 'flex', gap: '4px' }}>
          <Link
            to="/"
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none',
              color: location.pathname === '/' ? '#5B4FD9' : 'var(--color-text-secondary)',
              background: location.pathname === '/' ? '#EDE9FF' : 'transparent',
              fontWeight: location.pathname === '/' ? '500' : '400',
            }}
          >
            Editor
          </Link>
          <Link
            to="/history"
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none',
              color: location.pathname === '/history' ? '#5B4FD9' : 'var(--color-text-secondary)',
              background: location.pathname === '/history' ? '#EDE9FF' : 'transparent',
              fontWeight: location.pathname === '/history' ? '500' : '400',
            }}
          >
            History
          </Link>
        </nav>
      </div>

      {/* Right: user info + logout */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px', padding: '5px 12px', borderRadius: '6px',
              border: '1px solid var(--color-border-secondary)',
              background: 'transparent', color: 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;