// src/pages/OsonConfigPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { osonConfigService } from '../api/osonConfigService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const OsonConfigPage = () => {
    const initialConfigState = {
        apiUrl: '',
        apiKey: '',
        phone: '',
        password: '',
        deviceId: '',
        deviceName: '',
    };

    const [config, setConfig] = useState(initialConfigState);
    const [doesConfigExist, setDoesConfigExist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [logString, setLogString] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fetchConfig = useCallback(async () => {
        try {
            setError('');
            setIsLoading(true);
            const response = await osonConfigService.getOsonConfig();
            if (response.data) {
                setConfig(response.data);
                setDoesConfigExist(true);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setConfig(initialConfigState);
                setDoesConfigExist(false);
            } else {
                setError('Oson konfiguratsiyasini yuklashda xatolik.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    // QAYTARILDI: Bu funksiya faqat textarea holatini yangilaydi
    const handleLogStringChange = (e) => {
        setLogString(e.target.value);
    };

    // QAYTARILDI VA TUZATILDI: Ma'lumotlarni tahlil qilish va formani to'ldirish uchun funksiya
    const applyLogDataToForm = () => {
        if (!logString) return;

        try {
            const updates = {};
            // Ishonchliroq tahlil qilish usuli: `&` va `=` bo'yicha bo'lish
            const pairs = logString.split('&');

            pairs.forEach(pair => {
                const parts = pair.split('=');
                if (parts.length === 2) {
                    // Kalitdagi va qiymatdagi bo'shliqlarni olib tashlaymiz (trim)
                    const key = parts[0].trim();
                    const value = parts[1].trim();

                    switch (key) {
                        case 'phone':
                            updates.phone = value;
                            break;
                        case 'password':
                            updates.password = value;
                            break;
                        case 'dev_id':
                            updates.deviceId = value;
                            break;
                        // "device_ name" kabi bo'shliq bilan yozilgan kalitni ham ishlaydi
                        case 'device_ name':
                            updates.deviceName = value;
                            break;
                        default:
                            break;
                    }
                }
            });

            if (Object.keys(updates).length > 0) {
                setConfig(prevConfig => ({ ...prevConfig, ...updates }));
                setError('');
            } else {
                setError("Joylashtirilgan ma'lumotlardan kerakli maydonlar topilmadi.");
            }
        } catch (error) {
            console.error('Joylashtirilgan matnni tahlil qilib bo‘lmadi:', error);
            setError("Joylashtirilgan ma'lumotlar formati noto'g'ri. Iltimos, tekshirib ko'ring.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const apiCall = doesConfigExist
                ? osonConfigService.updateOsonConfig(config)
                : osonConfigService.saveOsonConfig(config);
            await apiCall;
            setSuccess('Konfiguratsiya muvaffaqiyatli saqlandi!');
            setDoesConfigExist(true);
        } catch (err) {
            setError('Konfiguratsiyani saqlashda xatolik. Iltimos, ma\'lumotlarni tekshirib, qayta urining.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Haqiqatan ham Oson konfiguratsiyasini oʻchirmoqchimisiz? Bu amalni bekor qilib boʻlmaydi.')) {
            return;
        }
        setIsSaving(true);
        try {
            await osonConfigService.deleteOsonConfig();
            setSuccess('Konfiguratsiya muvaffaqiyatli oʻchirildi.');
            setConfig(initialConfigState);
            setDoesConfigExist(false);
        } catch(err) {
            setError('Konfiguratsiyani oʻchirishda xatolik.');
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Oson API Konfiguratsiyasi</h1>
            </div>

            <div className="config-form-container">
                <form onSubmit={handleSubmit} className="form">

                    {/* QAYTARILDI: "Tez Kiritish" bo'limi siz xohlagan ko'rinishda */}
                    <div className="quick-paste-section">
                        <h3>Tez Kiritish</h3>
                        <p>Qurilmadan olingan to'liq ma'lumot qatorini bu yerga joylashtiring va "Ma'lumotlarni qo'llash" tugmasini bosing.</p>
                        <div className="form__group">
                            <label htmlFor="logPasteArea">Ma'lumotlar qatorini joylashtiring</label>
                            <textarea
                                id="logPasteArea"
                                value={logString}
                                onChange={handleLogStringChange} // Faqat qiymatni yangilaydi
                                placeholder="app_version=...&phone=...&password=...&dev_id=..."
                                rows="4"
                            />
                        </div>
                        {/* QAYTARILDI: Tugma */}
                        <div className="quick-paste-actions">
                            <Button
                                type="button"
                                onClick={applyLogDataToForm}
                                disabled={!logString}
                            >
                                Ma'lumotlarni Qo'llash
                            </Button>
                        </div>
                    </div>

                    {success && <p className="form__success">{success}</p>}
                    {error && <p className="form__error">{error}</p>}

                    <div className="form__group">
                        <label htmlFor="apiUrl">API Manzili (URL)</label>
                        <input type="text" name="apiUrl" value={config.apiUrl || ''} onChange={handleInputChange} placeholder="masalan, https://api.oson.uz/..." required />
                    </div>
                    <div className="form__group">
                        <label htmlFor="apiKey">API Kaliti</label>
                        <input type="text" name="apiKey" value={config.apiKey || ''} onChange={handleInputChange} placeholder="Sizning Oson API kalitingiz" required />
                    </div>
                    <div className="form__group">
                        <label htmlFor="phone">Telefon Raqami</label>
                        <input type="text" name="phone" value={config.phone || ''} onChange={handleInputChange} placeholder="Hisob qaydnomasi telefon raqami" required />
                    </div>

                    <div className="form__group password-input-container">
                        <label htmlFor="password">Parol</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={config.password || ''}
                            onChange={handleInputChange}
                            placeholder="Hisob qaydnomasi paroli"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className="form__group">
                        <label htmlFor="deviceId">Qurilma IDsi (dev_id)</label>
                        <input type="text" name="deviceId" value={config.deviceId || ''} onChange={handleInputChange} placeholder="Noyob qurilma identifikatori" required />
                    </div>
                    <div className="form__group">
                        <label htmlFor="deviceName">Qurilma Nomi (device_ name)</label>
                        <input type="text" name="deviceName" value={config.deviceName || ''} onChange={handleInputChange} placeholder="masalan, Asosiy Server" required />
                    </div>

                    <div className="form__actions">
                        <Button type="submit" primary disabled={isSaving}>
                            {isSaving ? 'Saqlanmoqda...' : 'Oʻzgarishlarni Saqlash'}
                        </Button>
                        <Button type="button" danger onClick={handleDelete} disabled={isSaving || !doesConfigExist}>
                            Konfiguratsiyani Oʻchirish
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OsonConfigPage;