import React, { useState, useEffect } from 'react';
import A4Page from '../components/Page.js';
import Editor from './Editor.js';
import Sidebar from '../components/Sidebar.js'
import TrainersCards from './TrainersCards.js';
import Login from './Login.js';

//NEED to add toggleSidebar={setOpen} to each component that i want the sidebar to be in

const HomeScreen = () => {

    const [isOpen, setOpen] = useState('')

    return (
        <div>
            {/* <A4Page toggleSidebar={setOpen} /> */}
            {/* <TinyMceEditor/> */}
            {/* <Sidebar isOpen={isOpen} setOpen={setOpen} /> */}
            {/* <TrainersCards /> */}
            <Login />
        </div>
    );
}

export default HomeScreen;