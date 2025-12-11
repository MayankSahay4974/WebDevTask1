import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resume, setResume] = useState('');
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setApplying(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post(`/applications/${id}`, { resume }, config);
            setMessage('Application submitted successfully!');
            setApplying(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error applying');
            setApplying(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!job) return <div className="container">Job not found</div>;

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <div className="card">
                <h1>{job.title}</h1>
                <h3 style={{ color: 'gray' }}>{job.company} - {job.location}</h3>
                <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '5px' }}>{job.type}</span>
                <p style={{ marginTop: '20px' }}>{job.description}</p>

                {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginTop: '10px' }}>{message}</div>}

                {user && user.role === 'candidate' ? (
                    <form onSubmit={handleApply} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <h4>Apply Now</h4>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Resume Link (Cloud URL)</label>
                            <input
                                type="url"
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                                required
                                placeholder="https://example.com/my-resume.pdf"
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={applying}>
                            {applying ? 'Applying...' : 'Submit Application'}
                        </button>
                    </form>
                ) : (
                    !user && (
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={() => navigate('/login')} className="btn-primary">Login to Apply</button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default JobDetail;
