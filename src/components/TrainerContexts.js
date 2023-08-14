import React, { createContext, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';

export const SETLOADING = 'SETLOADING';

const initialState = {
    isLoading: false
};

const reducer = (state, action) => {

    switch (action.type) {
        case SETLOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }

        default: {
            toast.error("WRONG INPUT IN DISPATCHING TRAINER INFO");
            return state;
        }

    }

}

// Create the context
const TrainerContext = createContext();

// Create a custom hook to access the context value
export const useTrainerContext = () => {
    const context = useContext(TrainerContext);
    if (!context) {
        toast.error('useTrainerContext must be used within a TrainerProvider');
    }
    return context;
};

// Create the TrainerProvider component to wrap the entire application with the context
export const TrainerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log('Provider')
    return (
        <TrainerContext.Provider value={{ state, dispatch }}>
            {children}
        </TrainerContext.Provider>
    );
};
