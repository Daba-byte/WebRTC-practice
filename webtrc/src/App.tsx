import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import VideoCall from './pages/VideoCall';

const App: React.FC = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<VideoCall />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
