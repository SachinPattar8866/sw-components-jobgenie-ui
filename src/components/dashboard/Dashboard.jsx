import React, { useState, useEffect, useRef } from 'react';
import { getDashboardData, uploadResume } from '../../services/api';
import Modal from '../common/Modal';
import './Dashboard.css';

function Dashboard() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploads, setUploads] = useState([]); // local list of uploaded resumes
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await getDashboardData();
                setMessage(data.message);
                setError('');
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please log in.');
                setMessage('');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const validateFile = (f) => {
        if (!f) return 'No file selected';
        const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!allowed.includes(f.type)) return 'Only PDF or DOCX files are allowed';
        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (f.size > maxBytes) return 'File is too large (max 5MB)';
        return null;
    };

    const handleFileChange = (e) => {
        setUploadError('');
        setExtractedText('');
        const f = e.target.files?.[0];
        setFile(f || null);
        const v = validateFile(f);
        if (v) setUploadError(v);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setUploadError('');
        const f = e.dataTransfer.files?.[0];
        if (f) {
            setFile(f);
            const v = validateFile(f);
            if (v) setUploadError(v);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleUpload = async () => {
        setUploadError('');
        setExtractedText('');
        setProgress(0);
        const v = validateFile(file);
        if (v) {
            setUploadError(v);
            return;
        }
        setUploading(true);
        try {
            // simple progress simulation (replace with axios onUploadProgress if needed)
            const interval = setInterval(() => setProgress((p) => Math.min(95, p + Math.floor(Math.random() * 10) + 5)), 300);
            const res = await uploadResume(file);
            clearInterval(interval);
            setProgress(100);

            const extracted = res?.extracted_text || res?.extractedText || res?.text || '';
            setExtractedText(extracted);
            const uploaded = {
                id: Date.now(),
                name: file.name,
                uploadedAt: new Date().toISOString(),
                status: extracted ? 'parsed' : 'uploaded',
                text: extracted,
                url: res?.resume_url || res?.fileUrl || ''
            };
            setUploads((s) => [uploaded, ...s]);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (extracted) setMessage('Resume uploaded and parsed successfully');
        } catch (err) {
            console.error('Upload failed', err);
            setUploadError(err?.error || err || 'Upload failed');
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(0), 800);
        }
    };

    const handleClear = () => {
        setFile(null);
        setExtractedText('');
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <div>
                    <h2>📂 Resume Uploads</h2>
                    <p className="muted">Upload, manage, and analyze your resumes in one place</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <label className="primary-btn" onClick={() => fileInputRef.current?.click()}>+ Upload Resume</label>
                    <button className="ghost-btn" title="Supported: PDF, DOCX. Max 5MB">?</button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <p className="success-message">{message}</p>

                    <input ref={fileInputRef} type="file" accept=".pdf, .docx, .doc" onChange={handleFileChange} style={{ display: 'none' }} />

                    <div
                        className={`upload-card ${isDragging ? 'dragging' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onClick={(e) => {
                            // don't trigger file picker when clicking buttons or links inside the card
                            const tag = e.target && e.target.tagName && e.target.tagName.toLowerCase();
                            if (tag === 'button' || tag === 'a' || tag === 'input') return;
                            fileInputRef.current?.click();
                        }}
                    >
                        <div className="upload-inner">
                            <div className="doc-icon">📄</div>
                            <div>
                                <div style={{ fontWeight: 700 }}>Drag & drop your resume here, or click to browse</div>
                                <div className="muted">Supported: PDF, DOCX — Max size: 5MB</div>
                                {file && <div className="file-info">Selected: {file.name} ({(file.size/1024).toFixed(1)} KB)</div>}
                                {uploadError && <div className="error-message">{uploadError}</div>}
                            </div>
                        </div>

                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => {
                                    if (uploading) return;
                                    if (!file) {
                                        // show a clear inline message when user clicks Upload without selecting a file
                                        setUploadError('Please choose a resume to upload');
                                        return;
                                    }
                                    handleUpload();
                                }}
                                className="primary-btn"
                            >
                                {uploading ? `Uploading ${progress}%` : 'Upload'}
                            </button>
                            <button onClick={handleClear} className="ghost-btn">Clear</button>
                        </div>
                        {progress > 0 && <div className="progress"><div style={{ width: `${progress}%` }} /></div>}
                    </div>

                    <div className="resume-list">
                        <h3>Your Resumes</h3>
                        {uploads.length === 0 ? (
                            <div className="empty-state">No resumes yet. Upload your first resume to get AI-powered insights 🚀</div>
                        ) : (
                            <table className="uploads-table">
                                <thead>
                                    <tr><th>File</th><th>Uploaded On</th><th>Status</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {uploads.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{new Date(u.uploadedAt).toLocaleString()}</td>
                                            <td><span className={`badge ${u.status==='parsed' ? 'green' : 'gray'}`}>{u.status}</span></td>
                                            <td>
                                                <button onClick={() => { setPreviewTitle(u.name); setExtractedText(u.text); setPreviewOpen(true); }}>View</button>
                                                {u.url && <a href={u.url} target="_blank" rel="noreferrer">Download</a>}
                                                <button onClick={() => setUploads((s)=>s.filter(x=>x.id!==u.id))}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title={previewTitle}>
                        {extractedText ? <pre className="preview-box">{extractedText}</pre> : <p className="muted">No preview available</p>}
                        <div style={{ marginTop: 12 }}>
                            <button className="primary-btn">✨ Send to AI Rewrite</button>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
}

export default Dashboard;