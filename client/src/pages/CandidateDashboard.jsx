import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await api.get('/applications/my', config);
                setApplications(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchApplications();
    }, [user]);

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <h1>My Applications</h1>
            {applications.length === 0 ? <p>You haven't applied to any jobs yet.</p> : (
                <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                    {applications.map(app => (
                        <div key={app._id} className="card">
                            <h3>{app.job.title}</h3>
                            <p>{app.job.company} - {app.job.location}</p>
                            <p>Status: <span style={{ fontWeight: 'bold' }}>{app.status}</span></p>
                            <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
