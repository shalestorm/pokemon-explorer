import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'


const Pokedex = () => {
    const getInitialOffset = () => {
        const hash = window.location.hash;
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const queryParams = new URLSearchParams(queryString);
        const offset = queryParams.get('offset');
        return offset ? parseInt(offset, 10) : 0;
    };
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(getInitialOffset)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [totalCount, setTotalCount] = useState(0)
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [allPokemon, setAllPokemon] = useState([]);
    const [isSearching, setIsSearching] = useState(false);



    useEffect(() => {
        if (isSearching) return;
        const fetchPokemon = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
                const data = await res.json();

                const details = [];

                for (const pokemon of data.results) {
                    const detailRes = await fetch(pokemon.url);
                    if (!detailRes.ok) throw new Error(`Failed to catch ${pokemon.name}`);
                    const detailData = await detailRes.json();
                    details.push(detailData);
                }

                setPokemonList(details);
                setTotalCount(data.count);
                console.log(totalCount)
                console.log(offset)
            } catch (e) {
                console.error('Error catching Pokes:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [offset, isSearching]);



    useEffect(() => {
        localStorage.setItem('pokedexOffset', offset);
    }, [offset]);



    const goToStart = () => setOffset(0);
    const goToEnd = () => setOffset(Math.floor((totalCount - 1) / 20) * 20);
    useEffect(() => {
        navigate(`?offset=${offset}`, { replace: true });
    }, [offset, navigate]);


    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
                const data = await res.json();
                setAllPokemon(data.results);
            } catch (e) {
                console.error('Failed to fetch all Pokémon names', e);
            }
        };
        fetchAllPokemon();
    }, []);


    useEffect(() => {
        const searchPokemon = async () => {
            if (searchTerm === '') {
                setIsSearching(false);
                setPokemonList([]);
                return;
            }

            setIsSearching(true);
            const filtered = allPokemon.filter(p => p.name.includes(searchTerm.toLowerCase()));
            const results = [];

            for (const p of filtered.slice(0, 20)) {
                try {
                    const res = await fetch(p.url);
                    const data = await res.json();
                    results.push(data);
                } catch (e) {
                    console.error(`Error loading ${p.name}`, e);
                }
            }
            setPokemonList(results);
        };

        searchPokemon();
    }, [searchTerm]);


    return (
        <div>
            <button onClick={toggleTheme}>
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <div className="button-container">


                <div className="button-pairs">
                    <button onClick={goToStart} disabled={isSearching || offset === 0}>Start</button>
                    <button onClick={() => { setOffset(offset - 20); }} disabled={isSearching || offset === 0}>
                        Page Left
                    </button>
                </div>
                <div className='button-pairs'>
                    <input
                        type="text"
                        placeholder="Search Pokémon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => setSearchTerm('')}>Clear</button>
                </div>
                <div className="button-pairs">
                    <button onClick={() => { setOffset(offset + 20); }} disabled={isSearching || offset + 20 >= totalCount}>
                        Page Right
                    </button>
                    <button onClick={goToEnd} disabled={isSearching || offset + 20 >= totalCount}>End</button>
                </div>

            </div>
            {loading && <p>Loading pokes!</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div className="card-grid">
                    {pokemonList.map((pokemon) => (
                        <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className="card">
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} className={clsx({ invert: theme === 'dark' })} />
                            <h3>{pokemon.name}</h3>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Pokedex;
