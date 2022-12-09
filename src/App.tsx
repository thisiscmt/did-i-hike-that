import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import ErrorPage from './pages/ErrorPage/ErrorPage';
import Home from './pages/Home/Home';
import './App.scss';

function App() {
    return (
        <main className='main-content'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
