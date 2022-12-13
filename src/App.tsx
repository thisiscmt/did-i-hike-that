import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Preferences from './pages/Preferences/Preferences';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import './App.scss';

function App() {
    return (
        <main>
            <BrowserRouter>
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/hike/:hikeId" element={<ViewHike />} />
                    <Route path="/hike/:hikeId/edit" element={<EditHike />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
