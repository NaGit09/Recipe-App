import { useEffect, useState } from 'react';
import { BankCard } from '../types/bank.type';
import { StorageInstance } from '../utils/storage';

const BANK_CARD_KEY = 'settings_bank_card';

const defaultBankCard: BankCard = {
    bankName: "Vietcombank",
    cardNumber: "2445 4395 2948 1234",
    ownerName: "Card Holder",
};

export const useProfile = () => {
    const [bankCard, setBankCard] = useState<BankCard>(defaultBankCard);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBankCard();
    }, []);

    const loadBankCard = async () => {
        try {
            const storedCard = await StorageInstance.getItem(BANK_CARD_KEY);
            if (storedCard) {
                setBankCard(JSON.parse(storedCard));
            }
        } catch (error) {
            console.error('Failed to load bank card:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateBankCard = async (newCard: BankCard) => {
        try {
            setBankCard(newCard);
            await StorageInstance.setItem(BANK_CARD_KEY, JSON.stringify(newCard));
            return true;
        } catch (error) {
            console.error('Failed to save bank card:', error);
            return false;
        }
    };

    return {
        bankCard,
        updateBankCard,
        loading
    };
};
