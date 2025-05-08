import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import PokemonDetails from './pages/Pokemondetails'
import NotFound from './pages/NotFound'
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import bgLight from './assets/bg-light.mp4';
import bgDark from './assets/bg-dark.mp4';





const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`app-container ${theme}`}>
      <div className="video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          key={theme}
        >
          <source src={theme === 'dark' ? bgDark : bgLight} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="content-overlay">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
export default App;
