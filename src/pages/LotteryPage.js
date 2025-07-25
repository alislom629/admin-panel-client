// src/pages/LotteryPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { lotteryService } from '../api/lotteryService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FiGift } from 'react-icons/fi';

const LotteryPage = () => {
    // General Page State
    const [prizes, setPrizes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Prize Management State
    const [newPrize, setNewPrize] = useState({ amount: '', numberOfPrize: '' });

    // User Search & Actions State
    const [searchChatId, setSearchChatId] = useState('');
    const [userBalance, setUserBalance] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [ticketsToAdd, setTicketsToAdd] = useState(1);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);

    // Random Award State
    const [randomAward, setRandomAward] = useState({ totalUsers: '', randomUsers: '', amount: '' });
    const [isAwarding, setIsAwarding] = useState(false);

    // --- Data Fetching ---
    const fetchPrizes = useCallback(async () => {
        try {
            if (isLoading) {
                setError('');
                const response = await lotteryService.getPrizes();
                setPrizes(response.data);
            }
        } catch (err) {
            setError("Sovrinlarni yuklab bo'lmadi.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchPrizes();
    }, [fetchPrizes]);

    // --- Prize Management Handlers ---
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
            setIsLoading(true);
        } catch (err) {
            setError("Sovrin qo'shib bo'lmadi.");
            console.error(err);
        }
    };

    const handleDeletePrize = async (id) => {
        if (window.confirm("Haqiqatan ham bu sovrinni o'chirmoqchimisiz?")) {
            try {
                await lotteryService.deletePrize(id);
                setIsLoading(true);
            } catch (err) {
                setError("Sovrinni o'chirib bo'lmadi.");
                console.error(err);
            }
        }
    };

    // --- User Search & Actions Handlers ---
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
            setError("Foydalanuvchi topilmadi.");
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddTickets = async () => {
        if (!ticketsToAdd || ticketsToAdd < 1) {
            alert("Iltimos, yaroqli bilet sonini kiriting.");
            return;
        }
        setIsSubmittingAction(true);
        try {
            const response = await lotteryService.addTickets(userBalance.chatId, ticketsToAdd);
            setUserBalance(response.data);
            setTicketsToAdd(1);
        } catch (err) {
            setError("Bilet qo'shishda xatolik yuz berdi.");
            console.error(err);
        } finally {
            setIsSubmittingAction(false);
        }
    };

    const handleResetTickets = async () => {
        if (window.confirm("Haqiqatan ham bu foydalanuvchining barcha biletlarini o'chirmoqchimisiz?")) {
            setIsSubmittingAction(true);
            try {
                await lotteryService.resetTickets(userBalance.chatId);
                const response = await lotteryService.getUserBalance(userBalance.chatId);
                setUserBalance(response.data);
            } catch (err) {
                setError("Biletlarni o'chirishda xatolik yuz berdi.");
                console.error(err);
            } finally {
                setIsSubmittingAction(false);
            }
        }
    };

    const handleResetBalance = async () => {
        if (window.confirm("DIQQAT! Haqiqatan ham bu foydalanuvchining balansini nolga tenglashtirmoqchimisiz?")) {
            setIsSubmittingAction(true);
            try {
                await lotteryService.resetBalance(userBalance.chatId);
                const response = await lotteryService.getUserBalance(userBalance.chatId);
                setUserBalance(response.data);
            } catch (err) {
                setError("Balansni o'chirishda xatolik yuz berdi.");
                console.error(err);
            } finally {
                setIsSubmittingAction(false);
            }
        }
    };

    // --- Random Money Award Handlers ---
    const handleRandomAwardChange = (e) => {
        const { name, value } = e.target;
        setRandomAward(prev => ({ ...prev, [name]: value }));
    };

    const handleRandomAwardSubmit = async (e) => {
        e.preventDefault();
        const { totalUsers, randomUsers, amount } = randomAward;
        if (!totalUsers || !randomUsers || !amount) {
            alert("Iltimos, barcha maydonlarni to'ldiring.");
            return;
        }
        if (parseInt(randomUsers) > parseInt(totalUsers)) {
            alert("Tasodifiy foydalanuvchilar soni umumiy foydalanuvchilar sonidan ko'p bo'lishi mumkin emas.");
            return;
        }

        setIsAwarding(true);
        setError('');
        setSuccessMessage('');

        try {
            await lotteryService.awardRandomUsers(randomAward);
            setSuccessMessage("Pul mukofoti tasodifiy foydalanuvchilarga muvaffaqiyatli tarqatildi!");
            setRandomAward({ totalUsers: '', randomUsers: '', amount: '' });
        } catch (err) {
            setError("Amalni bajarishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
            console.error(err);
        } finally {
            setIsAwarding(false);
        }
    };

    const totalNumberOfPrizes = prizes.reduce((total, prize) => total + (Number(prize.numberOfPrize) || 0), 0);

    if (isLoading) return <Loader />;

    return (
        <div className="page-container lottery-page">
            <div className="page-header"> <h1>Lotereya Tizimi</h1> </div>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="lottery-content-grid">
                {/* Prize Management Panel */}
                <div className="lottery-panel">
                    <h3>Sovrinlarni Boshqarish</h3>
                    <form onSubmit={handleAddPrize} className="form">
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

                {/* User Search & Actions Panel */}
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
                        <>
                            <div className="simulation-results">
                                <h4>{userBalance.chatId} raqamli foydalanuvchi</h4>
                                <p>Joriy balans: <span>{Number(userBalance.balance).toLocaleString('uz-UZ')} So'm</span></p>
                                <p>Mavjud biletlar: <span>{userBalance.tickets}</span></p>
                            </div>
                            <div className="user-actions-panel">
                                <h5>Foydalanuvchi Amallari</h5>
                                <div className="add-tickets-form">
                                    <input type="number" value={ticketsToAdd} onChange={(e) => setTicketsToAdd(e.target.value)} min="1" disabled={isSubmittingAction} />
                                    <Button onClick={handleAddTickets} primary disabled={isSubmittingAction}>Bilet Qo'shish</Button>
                                </div>
                                <div className="reset-actions">
                                    <Button onClick={handleResetTickets} danger disabled={isSubmittingAction}>Biletlarni O'chirish</Button>
                                    <Button onClick={handleResetBalance} danger disabled={isSubmittingAction}>Balansni O'chirish</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Random Money Award Panel */}
                <div className="lottery-panel full-width-panel">
                    <h3>Tasodifiy Foydalanuvchilarga Pul Berish</h3>
                    <p className="panel-description">
                        Bu yerda siz foydalanuvchilarning umumiy sonidan tasodifiy tanlab olinganlarga ma'lum miqdorda pul mukofoti berishingiz mumkin.
                    </p>
                    <form onSubmit={handleRandomAwardSubmit} className="random-award-form">
                        <div className="form__group">
                            <label htmlFor="totalUsers">Umumiy Foydalanuvchilar Soni</label>
                            <input type="number" name="totalUsers" value={randomAward.totalUsers} onChange={handleRandomAwardChange} placeholder="Masalan, 1000" required />
                        </div>
                        <div className="form__group">
                            <label htmlFor="randomUsers">Tasodifiy Foydalanuvchilar</label>
                            <input type="number" name="randomUsers" value={randomAward.randomUsers} onChange={handleRandomAwardChange} placeholder="Masalan, 10" required />
                        </div>
                        <div className="form__group">
                            <label htmlFor="amount">Pul Miqdori (har biriga)</label>
                            <input type="number" name="amount" value={randomAward.amount} onChange={handleRandomAwardChange} placeholder="Masalan, 50000" required />
                        </div>
                        <div className="form__group submit-group">
                            <Button type="submit" primary disabled={isAwarding}>
                                {isAwarding ? 'Yuborilmoqda...' : 'Pulni Tarqatish'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LotteryPage;