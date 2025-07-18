// src/pages/CardsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { cardService } from '../api/cardService';
import CardForm from '../components/CardForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';

const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const fetchCards = useCallback(async () => {
        try {
            const response = await cardService.getCards();
            setCards(response.data);
            setError(null);
        } catch (err) {
            setError('Kartalarni yuklashda xatolik. Iltimos, keyinroq qayta urining.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleOpenModal = (card = null) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleSave = () => {
        fetchCards();
        handleCloseModal();
    };

    const handleDelete = async (cardId) => {
        if (window.confirm('Haqiqatan ham ushbu kartani oʻchirmoqchimisiz?')) {
            try {
                await cardService.deleteCard(cardId);
                fetchCards();
            } catch (err) {
                alert('Kartani oʻchirishda xatolik.');
            }
        }
    };

    const handleSyncFromOson = async () => {
        const isConfirmed = window.confirm(
            "This will sync your cards with Oson Wallet.\n\n" +
            "• New cards from Oson will be added.\n" +
            "• Existing cards will be updated with the latest balance.\n\n" +
            "This action does NOT delete cards from your local list that are no longer in Oson.\n\n" +
            "Are you sure you want to proceed?"
        );

        if (isConfirmed) {
            setIsSyncing(true);
            setError(null);
            try {
                await cardService.syncCardsFromOson();

                // --- MODIFIED: Simplified the success message ---
                // The API no longer returns a walletBalance, so we just show a generic success message.
                alert('Sync successful!');

                // IMPORTANT: Re-fetch the cards from our own DB to get the updated list.
                await fetchCards();

            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Failed to sync from Oson. Please try again.';
                setError(errorMessage);
            } finally {
                setIsSyncing(false);
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Kartalarni Boshqarish</h1>
                <div className="page-header__actions">
                    <Button onClick={handleSyncFromOson} disabled={isSyncing || isLoading}>
                        <FiRefreshCw className={isSyncing ? 'spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync from Oson'}
                    </Button>
                    <Button primary onClick={() => handleOpenModal()}>
                        <FiPlus /> Yangi Karta
                    </Button>
                </div>
            </div>

            {(isLoading || isSyncing) && <Loader />}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                <div className="card-grid">
                    {cards.length > 0 ? (
                        cards.map(card => (
                            <div key={card.id} className="data-card">
                                <div className="data-card__content">
                                    <p><strong>Egasi:</strong> {card.ownerName || 'Noma\'lum'}</p>
                                    <p><strong>Karta raqami:</strong> <span>{card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}</span></p>
                                    <p><strong>Muddati:</strong> {card.expireDate || 'N/A'}</p>
                                    <p className="data-card__balance">
                                        <strong>Balans: </strong>
                                        <span>{(card.balance / 100).toFixed(2)} UZS</span>
                                    </p>
                                </div>
                                <div className="data-card__actions">
                                    <Button onClick={() => handleOpenModal(card)}>Tahrirlash</Button>
                                    <Button danger onClick={() => handleDelete(card.id)}>Oʻchirish</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Kartalar topilmadi. Oson bilan sinxronlang yoki yangi karta qo'shing.</p>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2>{selectedCard ? 'Kartani Tahrirlash' : 'Yangi Karta Qo\'shish'}</h2>
                <CardForm card={selectedCard} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default CardsPage;