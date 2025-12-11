import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Actually we need an endpoint to get jobs by employer. 
        // For now filtering on client side or adding a query param if supported by API.
        // Our API getJobs supports keyword but not employer ID directly in public API.
        // We should create a backend endpoint like /api/jobs?employer=ID or just filter here.
        // Better: let's filter client side for MVP or add endpoint support.
        // Actually, createJob adds employer field.
        // Let's simple fetch all and filter.
        const fetchMyJobs = async () => {
            const { data } = await api.get('/jobs');
            const myJobs = data.filter(job => job.employer._id === user._id || job.employer === user._id);
            setJobs(myJobs);
        };
        if (user) fetchMyJobs();
    }, [user]);

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Employer Dashboard</h1>
                <Link to="/employer/create-job" className="btn-primary">Post New Job</Link>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>My Posted Jobs</h2>
                {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {jobs.map(job => (
                            <div key={job._id} className="card">
                                <h3>{job.title}</h3>
                                <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                                <ApplicationsList jobId={job._id} token={user.token} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ApplicationsList = ({ jobId, token }) => {
    const [applications, setApplications] = useState([]);
    const [show, setShow] = useState(false);

    const fetchApplications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get(`/applications/job/${jobId}`, config);
            setApplications(data);
            setShow(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <button onClick={() => show ? setShow(false) : fetchApplications()} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
                {show ? 'Hide Applications' : 'View Applications'}
            </button>
            {show && (
                <div style={{ marginTop: '10px', background: '#f8f9fa', padding: '10px' }}>
                    {applications.length === 0 && <p>No applications yet.</p>}
                    {applications.map(app => (
                        <div key={app._id} style={{ borderBottom: '1px solid #ddd', padding: '5px 0' }}>
                            <p><strong>{app.candidate.name}</strong> ({app.candidate.email})</p>
                            <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EmployerDashboard;
