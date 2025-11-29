import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SelectElement from './pages/SelectElement';
import Results from './pages/Results';
import FireGame from './modules/game/fire/FireGame';
import WaterGame from './modules/game/water/WaterGame';
import WindGame from './modules/game/wind/WindGame';
import EarthGame from './modules/game/earth/EarthGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/selecionar" element={<SelectElement />} />
          <Route path="/jogo/fogo" element={<FireGame />} />
          <Route path="/jogo/agua" element={<WaterGame />} />
          <Route path="/jogo/vento" element={<WindGame />} />
          <Route path="/jogo/terra" element={<EarthGame />} />
          <Route path="/resultado" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
