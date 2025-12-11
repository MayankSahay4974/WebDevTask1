import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <header className="hero" style={{ textAlign: 'center', padding: '50px 0' }}>
                <h1>Find Your Dream Job Today</h1>
                <p>Connecting talent with opportunity.</p>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
                </div>
            </header>
        </div>
    );
};

export default Home;
