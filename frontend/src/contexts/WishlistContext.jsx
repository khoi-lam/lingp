import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('lingoland_wishlist')) || [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('lingoland_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const isInWishlist = (bookId) => wishlist.some(b => b._id === bookId || b.id === bookId);

    const toggleWishlist = (book) => {
        const id = book._id || book.id;
        setWishlist(prev =>
            prev.some(b => (b._id || b.id) === id)
                ? prev.filter(b => (b._id || b.id) !== id)
                : [...prev, { _id: id, title: book.title, author: book.author, price: book.price, originalPrice: book.originalPrice, images: book.images, image: book.image }]
        );
    };

    const removeFromWishlist = (bookId) => {
        setWishlist(prev => prev.filter(b => (b._id || b.id) !== bookId));
    };

    return (
        <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, removeFromWishlist, wishlistCount: wishlist.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
