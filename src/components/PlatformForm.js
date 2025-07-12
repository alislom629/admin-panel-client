import React, { useState, useEffect } from 'react';
import { platformService } from '../api/platformService';

// The form now gets an "id" to be linked to an external button
// and a function "setFormIsSubmitting" to tell the parent when it's busy.
const PlatformForm = ({ platform, onSave, id, setFormIsSubmitting }) => {
    const initialFormState = {
        name: '',
        currency: 'UZS',
        apiKey: '',
        login: '',
        password: '',
        workplaceId: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');

    useEffect(() => {
        if (platform) {
            setFormData({
                name: platform.name,
                currency: platform.currency,
                apiKey: platform.apiKey,
                login: platform.login,
                password: '', // Always empty for editing
                workplaceId: platform.workplaceId,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [platform]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFormIsSubmitting(true); // Tell the parent we are starting

        if (!formData.name || !formData.apiKey || !formData.login || !formData.workplaceId) {
            setError('Please fill out all required fields.');
            setFormIsSubmitting(false);
            return;
        }

        try {
            if (platform) {
                await platformService.updatePlatform(platform.id, formData);
            } else {
                if (!formData.password) {
                    setError('Password is required for new platforms.');
                    setFormIsSubmitting(false);
                    return;
                }
                await platformService.createPlatform(formData);
            }
            onSave();
        } catch (err) {
            setError('Failed to save platform. Please check the details and try again.');
            console.error(err);
        } finally {
            setFormIsSubmitting(false); // Tell the parent we are finished
        }
    };

    // The <form> now has an ID, and the action buttons are gone.
    return (
        <form onSubmit={handleSubmit} className="form" id={id}>
            {error && <p className="form__error">{error}</p>}
            <div className="form__grid">
                <div className="form__group">
                    <label htmlFor="name">Platform Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form__group">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
                        <option value="UZS">UZS</option>
                        <option value="RUB">RUB</option>
                    </select>
                </div>
            </div>
            <div className="form__group">
                <label htmlFor="apiKey">API Key</label>
                <input type="text" id="apiKey" name="apiKey" value={formData.apiKey} onChange={handleChange} required />
            </div>
            <div className="form__grid">
                <div className="form__group">
                    <label htmlFor="login">Login</label>
                    <input type="text" id="login" name="login" value={formData.login} onChange={handleChange} required />
                </div>
                <div className="form__group">
                    <label htmlFor="password">Password {platform ? '(Leave blank to keep current)' : ''}</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required={!platform} />
                </div>
            </div>
            <div className="form__group">
                <label htmlFor="workplaceId">Workplace ID</label>
                <input type="text" id="workplaceId" name="workplaceId" value={formData.workplaceId} onChange={handleChange} required />
            </div>
        </form>
    );
};

export default PlatformForm;