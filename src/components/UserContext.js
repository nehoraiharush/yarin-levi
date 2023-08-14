import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const SETUSER = 'SETUSER';

// Create the context
const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        toast.error('useUserContext must be used within a UserProvider');
    }
    return context;
};

const reducer = (state, action) => {

    switch (action.type) {
        case SETUSER:
            return { ...action.payload.user };

        default:
            toast.error("ERROR DISPATCHING USER");
            return state;
    }

}

export const UserProvider = ({ children }) => {
    const [user, dispatchUser] = useReducer(reducer, null);

    useEffect(() => {

        if (user) {

        }

    }, [user])

    console.log(auth?.currentUser?.email)
    return (
        <UserContext.Provider value={{ user, dispatchUser }}>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {children}
        </UserContext.Provider>
    );
};
