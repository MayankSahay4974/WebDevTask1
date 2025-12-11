import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (search = '') => {
        try {
            const { data } = await api.get(`/jobs?keyword=${search}`);
            setJobs(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(keyword);
    };

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <h1>Latest Jobs</h1>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button type="submit" className="btn-primary">Search</button>
            </form>

            {loading ? <p>Loading...</p> : (
                <div>
                    {jobs.map(job => (
                        <div key={job._id} className="card">
                            <h3>{job.title}</h3>
                            <p><strong>{job.company}</strong> - {job.location}</p>
                            <p>{job.type}</p>
                            <Link to={`/jobs/${job._id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>
                                View Details
                            </Link>
                        </div>
                    ))}
                    {jobs.length === 0 && <p>No jobs found.</p>}
                </div>
            )}
        </div>
    );
};

export default JobList;
