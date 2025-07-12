// src/pages/CardsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { cardService } from '../api/cardService';
import CardForm from '../components/CardForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const handleDelete = async (cardId) => { // <-- Endi butun 'card' obyekti emas, faqat 'id' kerak
        // "Asosiy kartani o'chira olmaysiz" degan mantiq olib tashlandi
        if (window.confirm('Haqiqatan ham ushbu kartani oʻchirmoqchimisiz?')) {
            try {
                // <-- Endi 'card.id' o'rniga to'g'ridan-to'g'ri 'cardId' ishlatiladi
                await cardService.deleteCard(cardId);
                fetchCards();
            } catch (err) {
                alert('Kartani oʻchirishda xatolik.');
            }
        }
    };

    // handleSetMain funksiyasi butunlay o'chirildi
    // <-- O'CHIRILDI

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Kartalarni Boshqarish</h1>
                <Button primary onClick={() => handleOpenModal()}>+ Yangi Karta Qo'shish</Button>
            </div>

            {isLoading && <Loader />}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                <div className="card-grid">
                    {cards.length > 0 ? (
                        cards.map(card => (
                            // <-- Maxsus 'data-card--main' klassi olib tashlandi
                            <div key={card.id} className="data-card">
                                {/* <-- "ASOSIY" tasmasi (ribbon) olib tashlandi */}
                                <div className="data-card__content">
                                    <p><strong>Egasi:</strong> {card.ownerName}</p>
                                    <p><strong>Karta raqami:</strong> <span>{card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}</span></p>
                                    <p><strong>Muddati:</strong> {card.expireDate}</p>
                                </div>
                                <div className="data-card__actions">
                                    {/* <-- "Asosiy qilish" tugmasi olib tashlandi */}
                                    <Button onClick={() => handleOpenModal(card)}>Tahrirlash</Button>
                                    {/* <-- O'chirish tugmasidan 'disabled' holati olib tashlandi */}
                                    <Button danger onClick={() => handleDelete(card.id)}>Oʻchirish</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Kartalar topilmadi. Boshlash uchun yangi karta qo'shing.</p>
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