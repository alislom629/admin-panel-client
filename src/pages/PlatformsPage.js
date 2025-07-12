// src/pages/PlatformPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { platformService } from '../api/platformService';
import PlatformForm from '../components/PlatformForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

// Import all necessary icons from react-icons
import {
    FiServer, FiPlus, FiDollarSign, FiUser, FiBriefcase, FiKey, FiCopy, FiCheck, FiEdit, FiTrash2, FiAlertCircle, FiLoader
} from 'react-icons/fi';

const PlatformPage = () => {
    // State for data and UI control
    const [platforms, setPlatforms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isFormSubmitting, setFormIsSubmitting] = useState(false);

    // State specifically for the copy-to-clipboard UI feedback
    const [copyingId, setCopyingId] = useState(null); // Tracks which key is being fetched/copied
    const [copiedId, setCopiedId] = useState(null);   // Tracks which key was successfully copied

    // --- Data Fetching ---
    const fetchPlatforms = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await platformService.getPlatforms();
            setPlatforms(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load platforms. Please refresh the page.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlatforms();
    }, [fetchPlatforms]);

    // --- Action Handlers ---

    const handleCopyToClipboard = async (id) => {
        setCopyingId(id);
        setCopiedId(null);

        try {
            const response = await platformService.getPlatform(id);
            const apiKey = response.data.apiKey;

            if (!apiKey) {
                alert('API Key not found for this platform.');
                return;
            }

            // Robust copy logic that works in both secure (https) and insecure (http) contexts
            if (navigator.clipboard && window.isSecureContext) {
                // Modern, secure way
                await navigator.clipboard.writeText(apiKey);
            } else {
                // Fallback for insecure contexts or older browsers
                const textArea = document.createElement('textarea');
                textArea.value = apiKey;
                textArea.style.position = 'absolute';
                textArea.style.left = '-9999px'; // Hide it
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            setCopiedId(id); // Show success message
        } catch (err) {
            console.error('Failed to copy API key:', err);
            alert('Could not retrieve or copy the API key.');
        } finally {
            setCopyingId(null); // Clear loading state
            setTimeout(() => setCopiedId(null), 2000); // Reset success message after 2 seconds
        }
    };

    const handleOpenAddModal = () => {
        setSelectedPlatform(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (platform) => {
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isFormSubmitting) return; // Prevent closing while form is busy
        setIsModalOpen(false);
        setSelectedPlatform(null);
    };

    const handleDeletePlatform = async (id) => {
        if (window.confirm('Are you sure you want to delete this platform?')) {
            try {
                await platformService.deletePlatform(id);
                fetchPlatforms();
            } catch (err) {
                alert('Failed to delete platform.');
            }
        }
    };

    const handleSaveSuccess = () => {
        fetchPlatforms();
        handleCloseModal();
    };


    // --- Render Logic ---

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="page-container platforms-page">
            <div className="page-header">
                <h1>Manage Platforms</h1>
                <Button primary onClick={handleOpenAddModal}>
                    <FiPlus /> Add New Platform
                </Button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {platforms.length > 0 ? (
                <div className="platforms-grid">
                    {platforms.map(platform => (
                        <div key={platform.id} className="platform-card">
                            <div className="platform-card__header">
                                <FiServer />
                                <h3>{platform.name}</h3>
                            </div>

                            <ul className="platform-card__body">
                                <li><FiDollarSign /><span>Currency:</span> {platform.currency}</li>
                                <li><FiUser /><span>Login:</span> {platform.login}</li>
                                <li><FiBriefcase /><span>Workplace ID:</span> {platform.workplaceId}</li>
                            </ul>

                            <div className="platform-card__api-key">
                                <div className="key-info">
                                    <FiKey />
                                    <span>API Key</span>
                                </div>
                                <Button
                                    onClick={() => handleCopyToClipboard(platform.id)}
                                    disabled={copyingId === platform.id || copiedId === platform.id}
                                >
                                    {copyingId === platform.id ? (
                                        <><FiLoader className="spinner" /> Copying...</>
                                    ) : copiedId === platform.id ? (
                                        <><FiCheck /> Copied!</>
                                    ) : (
                                        <><FiCopy /> Copy</>
                                    )}
                                </Button>
                            </div>

                            <div className="platform-card__footer">
                                <Button onClick={() => handleOpenEditModal(platform)}><FiEdit /> Edit</Button>
                                <Button danger onClick={() => handleDeletePlatform(platform.id)}><FiTrash2 /> Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-data-card">
                    <FiAlertCircle size={40} />
                    <p>No platforms have been added yet.</p>
                    <Button primary onClick={handleOpenAddModal}>Add your first platform</Button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2>{selectedPlatform ? 'Edit Platform' : 'Add New Platform'}</h2>
                <PlatformForm
                    platform={selectedPlatform}
                    onSave={handleSaveSuccess}
                    id="platform-modal-form"
                    setFormIsSubmitting={setFormIsSubmitting}
                />
                <div className="form__actions">
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button primary type="submit" form="platform-modal-form" disabled={isFormSubmitting}>
                        {isFormSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default PlatformPage;