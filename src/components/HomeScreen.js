import React, { useState, useEffect } from 'react';
import A4Page from './A4PageNew.js';
import MyComponent from './MyComponent.js';
import TinyMceEditor from './TinyMCE.js';

const HomeScreen = () => {
    return (
        <div>
            {/* <A4Page /> */}
            {/* <MyComponent /> */}
            {/* <TextEditor /> */}
            <TinyMceEditor />
        </div>
    );
}

export default HomeScreen;