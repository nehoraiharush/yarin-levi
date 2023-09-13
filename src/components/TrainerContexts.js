import React, { createContext, useContext, useReducer, useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getTrainersFromFirebase } from '../screens/TrainersCards';

export const SETLOADING = 'SETLOADING';
export const SETTRAINERS = 'SETTRAINERS';
export const SETMEETINGS = 'SETMEETINGS';

const initialState = {
    isLoading: false,
    trainersList: [],
    meetingsDict: {}
};

const reducer = (state, action) => {

    switch (action.type) {
        case SETLOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }

        case SETTRAINERS:
            return {
                ...state,
                trainersList: action.payload.trainersList
            }

        case SETMEETINGS:
            return {
                ...state,
                meetingsDict: action.payload.dict
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

const date = new Date();
const currentDay = parseInt(date.getDate());
const currentMonth = parseInt(date.getMonth() + 1);
const currentYear = parseInt(date.getFullYear());

export const TrainerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, setOpen] = useState('');

    const getData = async () => {
        if (state.trainersList.length <= 1) {
            try {
                const trainers = await getTrainersFromFirebase();
                dispatch({
                    type: SETTRAINERS,
                    payload: {
                        trainersList: [...trainers]
                    }
                })
            } catch (error) {
                toast.error(error.message);
            }

        }
    }

    const SortDict = (dict) => {

        const keys = Object.keys(dict);

        keys.sort();
        let sortedDict = {}
        for (const key of keys) {
            sortedDict[key] = dict[key]
        }
        return sortedDict;
    }

    //INIT MEETINGS
    useEffect(() => {
        if (state.trainersList.length > 1) {
            let dict = {};
            state.trainersList.forEach(trainer => {
                const meetingDate = trainer.nextMeeting.split('-')
                const year = parseInt(meetingDate[0]);
                const month = parseInt(meetingDate[1]);
                const day = parseInt(meetingDate[2]);
                if (year > currentYear
                    || (year === currentYear && month > currentMonth)
                    || (year === currentYear && month === currentMonth && day > currentDay)
                    || (year === currentYear && month === currentMonth && day === currentDay)) {
                    if (!dict[`${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`]) {
                        dict[`${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`] = [];
                    }
                    dict[
                        `${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    ].push(trainer.name)
                }
            });

            dict = SortDict(dict)

            dispatch({
                type: SETMEETINGS,
                payload: {
                    dict
                }
            })
        }

    }, [state.trainersList])

    useEffect(() => {
        getData();
    }, [])

    return (
        <TrainerContext.Provider value={{ state, isOpen, dispatch, setOpen }}>
            {children}
        </TrainerContext.Provider>
    );
};
