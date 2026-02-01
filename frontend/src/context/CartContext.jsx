import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const storedCart = localStorage.getItem(`cartItems_${user.id}`);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`cartItems_${user.id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = (product, qty = 1) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...x, qty: x.qty + qty } : x
                )
            );
            toast.success('Cart updated');
        } else {
            setCartItems([...cartItems, { ...product, qty }]);
            toast.success('Added to cart');
        }
    };

    const cartTotal = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
        toast.success('Removed from cart');
    };

    const clearCart = () => {
        setCartItems([]);
        if (user) {
            localStorage.removeItem(`cartItems_${user.id}`);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
