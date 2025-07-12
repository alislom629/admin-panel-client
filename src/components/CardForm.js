import React, { useState, useEffect } from 'react';
import { cardService } from '../api/cardService';
import Button from './common/Button';

const CardForm = ({ card, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        ownerName: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (card) {
            setFormData({
                cardNumber: card.cardNumber,
                ownerName: card.ownerName,
            });
        } else {
            setFormData({ cardNumber: '', ownerName: '' });
        }
    }, [card]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            setError('Card number must be 16 digits.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (card) {
                await cardService.updateCard(card.id, formData);
            } else {
                await cardService.createCard(formData);
            }
            onSave();
        } catch (err) {
            setError('Failed to save card. Please check the details and try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            {error && <p className="form__error">{error}</p>}
            <div className="form__group">
                <label htmlFor="ownerName">Owner Name</label>
                <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form__group">
                <label htmlFor="cardNumber">Card Number (16 digits)</label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength="16"
                    required
                />
            </div>
            <div className="form__actions">
                <Button type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" primary disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Card'}
                </Button>
            </div>
        </form>
    );
};

export default CardForm;