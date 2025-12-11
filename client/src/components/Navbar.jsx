import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">JobBoard</Link>
                <div className="menu">
                    <Link to="/jobs">Jobs</Link>
                    {user ? (
                        <>
                            {user.role === 'employer' && (
                                <Link to="/employer/dashboard">Dashboard</Link>
                            )}
                            {user.role === 'candidate' && (
                                <Link to="/candidate/dashboard">Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
