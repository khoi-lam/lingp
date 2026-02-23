import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_KEY = 'lingoland_cart';
import { API_BASE } from '../config.js';

function loadCart() {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (book, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i._id === book._id);
            if (existing) {
                return prev.map(i => i._id === book._id ? { ...i, quantity: i.quantity + qty } : i);
            }
            const imgSrc = book.images?.[0]
                ? (book.images[0].startsWith('http') ? book.images[0] : `${API_BASE}/${book.images[0]}`)
                : null;
            return [...prev, {
                _id: book._id,
                title: book.title,
                author: book.author,
                price: book.price,
                image: imgSrc,
                quantity: qty,
            }];
        });
    };

    const removeFromCart = (id) => setItems(prev => prev.filter(i => i._id !== id));

    const updateQty = (id, qty) => {
        if (qty <= 0) return removeFromCart(id);
        setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
