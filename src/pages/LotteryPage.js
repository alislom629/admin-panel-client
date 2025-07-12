// src/pages/LotteryPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { lotteryService } from '../api/lotteryService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FiGift } from 'react-icons/fi'; // <-- 1. Chiroyli ikona uchun import qilamiz

const LotteryPage = () => {
    // Holatlar (state)
    const [prizes, setPrizes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // "Sovrin qo'shish" formasi uchun holat
    const [newPrize, setNewPrize] = useState({ amount: '', numberOfPrize: '' });

    // Foydalanuvchini qidirish uchun holat
    const [searchChatId, setSearchChatId] = useState('');
    const [userBalance, setUserBalance] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // --- Sovrinlarni boshqarish logikasi ---

    const fetchPrizes = useCallback(async () => {
        try {
            setError('');
            setIsLoading(true);
            const response = await lotteryService.getPrizes();
            setPrizes(response.data);
        } catch (err) {
            setError("Sovrinlarni yuklab bo'lmadi. Iltimos, keyinroq qayta urinib ko'ring.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrizes();
    }, [fetchPrizes]);

    const handlePrizeInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrize(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPrize = async (e) => {
        e.preventDefault();
        if (!newPrize.amount || !newPrize.numberOfPrize) {
            alert("Iltimos, sovrin miqdori va sonini to'ldiring.");
            return;
        }
        try {
            await lotteryService.addPrize(newPrize);
            setNewPrize({ amount: '', numberOfPrize: '' });
            fetchPrizes();
        } catch (err) {
            setError("Sovrin qo'shib bo'lmadi.");
            console.error(err);
        }
    };

    const handleDeletePrize = async (id) => {
        if (window.confirm("Haqiqatan ham bu sovrinni o'chirmoqchimisiz?")) {
            try {
                await lotteryService.deletePrize(id);
                fetchPrizes();
            } catch (err) {
                setError("Sovrinni o'chirib bo'lmadi.");
                console.error(err);
            }
        }
    };

    // --- Foydalanuvchi balansini qidirish logikasi ---
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchChatId) {
            alert("Qidirish uchun Chat ID'ni kiriting.");
            return;
        }
        setIsSearching(true);
        setUserBalance(null);
        setError('');
        try {
            const response = await lotteryService.getUserBalance(searchChatId);
            setUserBalance(response.data);
        } catch (err) {
            setError("Foydalanuvchi topilmadi. Uning balans ma'lumotlari mavjud bo'lmasligi mumkin.");
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    // <-- 2. UMUMIY SOVRINLAR SONINI HISOBLEMIZ
    // Har bir re-renderda 'prizes' massividan jami sonni hisoblab olamiz
    const totalNumberOfPrizes = prizes.reduce((total, prize) => {
        return total + (Number(prize.numberOfPrize) || 0);
    }, 0);


    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="page-container lottery-page">
            <div className="page-header">
                <h1>Lotereya Tizimi</h1>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="lottery-content-grid">
                {/* Sovrinlarni Boshqarish Paneli */}
                <div className="lottery-panel">
                    <h3>Sovrinlarni Boshqarish</h3>
                    <form onSubmit={handleAddPrize} className="form">
                        {/* Form elementlari o'zgarmaydi */}
                        <div className="form__group">
                            <label htmlFor="amount">Sovrin Miqdori</label>
                            <input type="number" name="amount" value={newPrize.amount} onChange={handlePrizeInputChange} placeholder="Masalan, 100000" required />
                        </div>
                        <div className="form__group">
                            <label htmlFor="numberOfPrize">Sovrinlar Soni (Miqdori)</label>
                            <input type="number" name="numberOfPrize" value={newPrize.numberOfPrize} onChange={handlePrizeInputChange} placeholder="Masalan, 5" required />
                        </div>
                        <Button type="submit" primary>Sovrin Qo'shish</Button>
                    </form>

                    <h4>Mavjud Sovrinlar</h4>

                    {/* 3. YANGI STATISTIKA KARTASI QO'SHILDI */}
                    <div className="lottery-summary-card">
                        <FiGift className="summary-icon" />
                        <div className="summary-text">
                            <span className="summary-number">{totalNumberOfPrizes}</span>
                            <span className="summary-label">Umumiy Qolgan Sovrinlar</span>
                        </div>
                    </div>

                    <ul className="prize-list">
                        {prizes.length > 0 ? prizes.map(prize => (
                            <li key={prize.id}>
                                <div className="prize-info">
                                    <span>{Number(prize.amount).toLocaleString('uz-UZ')} So'm</span>
                                    <small>Soni: {prize.numberOfPrize}</small>
                                </div>
                                <Button danger onClick={() => handleDeletePrize(prize.id)}>O'chirish</Button>
                            </li>
                        )) : (
                            <li>Hozircha sozlanmagan sovrinlar yo'q.</li>
                        )}
                    </ul>
                </div>

                {/* Foydalanuvchi Balansini Tekshirish Paneli (o'zgarishsiz) */}
                <div className="lottery-panel">
                    <h3>Foydalanuvchi Balansini Tekshirish</h3>
                    <form onSubmit={handleSearchSubmit} className="form">
                        <div className="form__group">
                            <label htmlFor="chatId">Foydalanuvchi Chat ID'si</label>
                            <input type="number" name="chatId" value={searchChatId} onChange={(e) => setSearchChatId(e.target.value)} placeholder="Foydalanuvchining Chat ID'sini kiriting" required />
                        </div>
                        <div className="form__actions">
                            <Button type="submit" primary disabled={isSearching}>{isSearching ? 'Qidirilmoqda...' : 'Qidirish'}</Button>
                        </div>
                    </form>

                    {isSearching && <Loader />}

                    {userBalance && (
                        <div className="simulation-results">
                            <h4>{userBalance.chatId} raqamli foydalanuvchi uchun qidiruv natijasi</h4>
                            <p>Joriy balans: <span>{Number(userBalance.balance).toLocaleString('uz-UZ')} So'm</span></p>
                            <p>Mavjud biletlar: <span>{userBalance.tickets}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LotteryPage;