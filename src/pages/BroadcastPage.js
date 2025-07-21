// src/pages/BroadcastPage.js

import React, { useState, useEffect } from 'react';
import { broadcastService } from '../api/broadcastService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FiSend, FiLink, FiClock, FiX } from 'react-icons/fi';

const BroadcastPage = () => {
    const initialState = {
        messageText: '',
        buttonText: '',
        buttonUrl: '',
        scheduledTime: ''
    };
    const [formData, setFormData] = useState(initialState);
    const [isScheduled, setIsScheduled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: '...' }

    // Xabarnomani 5 soniyadan keyin avtomatik yopish
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleScheduleToggle = (e) => {
        setIsScheduled(e.target.checked);
        if (!e.target.checked) {
            setFormData(prev => ({ ...prev, scheduledTime: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.messageText) {
            setNotification({ type: 'error', message: 'Xabar matni bo\'sh bo\'lishi mumkin emas.' });
            return;
        }

        setIsSubmitting(true);
        setNotification(null);

        try {
            const payload = {
                ...formData,
                scheduledTime: isScheduled && formData.scheduledTime ? formData.scheduledTime : null,
            };

            await broadcastService.sendBroadcast(payload);

            setNotification({ type: 'success', message: 'Ommaviy xabar yuborish muvaffaqiyatli boshlandi!' });
            setFormData(initialState); // Muvaffaqiyatli yuborilganda formani tozalash
            setIsScheduled(false);
        } catch (err) {
            const errorMessage = err.response?.data || 'Xabarni yuborishda xatolik. Iltimos, qayta urunib ko\'ring.';
            setNotification({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container broadcast-page">
            <div className="page-header">
                <h1>Ommaviy Xabar Yuborish</h1>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="notification-close-btn">
                        <FiX />
                    </button>
                </div>
            )}

            <div className="broadcast-grid">
                {/* Chap panel: Forma */}
                <div className="broadcast-form-panel">
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form__group">
                            <label htmlFor="messageText">Xabar matni</label>
                            <textarea
                                id="messageText"
                                name="messageText"
                                rows="8"
                                placeholder="Xabaringizni shu yerda yozing... <b>, <i>, <a> kabi standart HTML teglaridan foydalanishingiz mumkin."
                                value={formData.messageText}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label htmlFor="buttonText">Tugma matni (Ixtiyoriy)</label>
                            <input
                                type="text"
                                id="buttonText"
                                name="buttonText"
                                placeholder="Masalan, Veb-saytimizga o'ting"
                                value={formData.buttonText}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form__group">
                            <label htmlFor="buttonUrl">Tugma havolasi (Ixtiyoriy)</label>
                            <input
                                type="url"
                                id="buttonUrl"
                                name="buttonUrl"
                                placeholder="https://example.com"
                                value={formData.buttonUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form__group form__group--checkbox">
                            <input
                                type="checkbox"
                                id="schedule"
                                checked={isScheduled}
                                onChange={handleScheduleToggle}
                            />
                            <label htmlFor="schedule">Keyinroqqa rejalashtirishmi?</label>
                        </div>

                        {isScheduled && (
                            <div className="form__group">
                                <label htmlFor="scheduledTime">Rejalashtirilgan vaqt</label>
                                <input
                                    type="datetime-local"
                                    id="scheduledTime"
                                    name="scheduledTime"
                                    value={formData.scheduledTime}
                                    onChange={handleChange}
                                    required={isScheduled}
                                />
                            </div>
                        )}

                        <Button type="submit" primary disabled={isSubmitting}>
                            {isSubmitting ? <Loader /> : <FiSend />}
                            {isScheduled && formData.scheduledTime ? 'Xabarni Rejalashtirish' : 'Darhol Yuborish'}
                        </Button>
                    </form>
                </div>

                {/* O'ng panel: Jonli ko'rinish */}
                <div className="broadcast-preview-panel">
                    <h3>Jonli Ko'rinish</h3>
                    <div className="preview-container">
                        <div className="chat-bubble">
                            <p dangerouslySetInnerHTML={{ __html: formData.messageText.replace(/\n/g, '<br />') || 'Sizning xabaringiz shu yerda ko\'rinadi...' }} />

                            {formData.buttonText && formData.buttonUrl && (
                                <a href={formData.buttonUrl} className="preview-button" target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
                                    <FiLink /> {formData.buttonText}
                                </a>
                            )}
                        </div>
                        {isScheduled && formData.scheduledTime && (
                            <div className="schedule-info">
                                <FiClock/> Rejalashtirildi: {new Date(formData.scheduledTime).toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastPage;