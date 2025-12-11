import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        type: 'Full-time'
    });
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.post('/jobs', formData, config);
            navigate('/employer/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating job');
        }
    };

    return (
        <div className="container" style={{ marginTop: '20px', maxWidth: '600px' }}>
            <div className="card">
                <h1>Post a New Job</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Job Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Company Name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Job Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" style={{ width: '100%', padding: '8px' }}></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Post Job</button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
