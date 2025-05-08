import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import clsx from 'clsx';

const PokemonDetails = () => {
    const { id } = useParams();
    const { theme } = useContext(ThemeContext);

    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [pokemonList, setPokemonList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [prevPokemonData, setPrevPokemonData] = useState(null);
    const [nextPokemonData, setNextPokemonData] = useState(null);
    const [moves, setMoves] = useState([])
    const [stats, setStats] = useState([])
    const [cryUrl, setCryUrl] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [allPokemon, setAllPokemon] = useState([]);
    const [isSearching, setIsSearching] = useState(false);



    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const resMeta = await fetch('https://pokeapi.co/api/v2/pokemon');
                const metaData = await resMeta.json();
                const resList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${metaData.count}`);
                const listData = await resList.json();
                setPokemonList(listData.results);
                const idx = listData.results.findIndex(p => p.url.includes(`/pokemon/${id}/`));
                setCurrentIndex(idx);
                const resCurrent = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const currentData = await resCurrent.json();
                setPokemon(currentData);
                setMoves(currentData.moves);
                setStats(currentData.stats);
                setCryUrl(currentData.cries.latest);
                console.log(cryUrl)

                if (idx > 0) {
                    const prevId = listData.results[idx - 1].url.split('/').filter(Boolean).pop();
                    const resPrev = await fetch(`https://pokeapi.co/api/v2/pokemon/${prevId}`);
                    const prevData = await resPrev.json();
                    setPrevPokemonData(prevData);
                } else {
                    setPrevPokemonData(null);
                }
                if (idx < listData.results.length - 1) {
                    const nextId = listData.results[idx + 1].url.split('/').filter(Boolean).pop();
                    const resNext = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
                    const nextData = await resNext.json();
                    setNextPokemonData(nextData);
                } else {
                    setNextPokemonData(null);
                }
                const pokeLen = pokemonList.length;
                console.log(pokeLen)

            } catch (e) {
                setError(e);
            }
        };

        fetchAllData();
    }, [id]);


    const isSTAB = (move) => {
        const pokemonTypes = pokemon.types.map((type) => type.type.name);
        return move.type && pokemonTypes.includes(move.type);
    };


    const cleanMovesData = () => {
        const categorizedMoves = {
            levelUp: [],
            tm: [],
            egg: [],
            other: [],
        };

        moves.forEach((move) => {
            const gameVersions = move.version_group_details.map((group) => group.version_group.name);
            const learnMethods = move.version_group_details.map((group) => group.move_learn_method.name);
            const learnLevels = move.version_group_details.map((group) => group.level_learned_at);


            const uniqueGameVersions = [...new Set(gameVersions)];
            const uniqueLearnMethods = [...new Set(learnMethods)];
            const uniqueLearnLevels = [...new Set(learnLevels)];

            const moveData = {
                move: move.move.name,
                gameVersions: uniqueGameVersions,
                learnMethods: uniqueLearnMethods,
                learnLevels: uniqueLearnLevels,
                type: move.move.name === 'gust' ? 'flying' : undefined,
            };


            if (moveData.learnMethods.includes('level-up')) {
                categorizedMoves.levelUp.push(moveData);
            } else if (moveData.learnMethods.includes('machine')) {
                categorizedMoves.tm.push(moveData);
            } else if (moveData.learnMethods.includes('egg')) {
                categorizedMoves.egg.push(moveData);
            } else {
                categorizedMoves.other.push(moveData);
            }
        });


        Object.keys(categorizedMoves).forEach((key) => {
            categorizedMoves[key].sort((a, b) => a.move.localeCompare(b.move));
        });

        return categorizedMoves;
    };
    const categorizedMoves = cleanMovesData();


    const playCry = () => {
        if (cryUrl) {
            const audio = new Audio(cryUrl);
            audio.volume = 0.4;
            audio.play();
        }
    };


    if (!pokemon || currentIndex === null) return <p>Loading - please wait...</p>;
    if (error) return <p>Error: {error.message}</p>;



    const MAX_STAT = 255;


    return (
        <div className="container">
            <Link to="/pokedex">Back to Pokedex</Link>

            <div className="pokes-imgs">
                <img src={pokemon.sprites.front_default} className='special' alt={`${pokemon.name}`} />
                <img src={pokemon.sprites.front_shiny} className='special' alt={`${pokemon.name}`} />
            </div>

            <h1 className='pokeName'>{pokemon.name}</h1>
            <button onClick={playCry}>Play Pokémon Cry</button>
            <h3>Height: {pokemon.height / 10}m</h3>
            <h3>Weight: {pokemon.weight / 10}kg</h3>
            <h3>Types: {pokemon.types.map(t => t.type.name).join(', ')}</h3>
            <h3>Abilities: {pokemon.abilities.map(a => a.ability.name).join(', ')}</h3>

            <div className="NavMons">
                <div>
                    {prevPokemonData && (
                        <Link to={`/pokemon/${prevPokemonData.id}`}>
                            <img
                                className='special'
                                src={prevPokemonData.sprites.front_default}
                                alt={`Previous: ${prevPokemonData.name}`}
                            />
                        </Link>
                    )}
                </div>
                <div>
                    {nextPokemonData && (
                        <Link to={`/pokemon/${nextPokemonData.id}`}>
                            <img
                                className='special'
                                src={nextPokemonData.sprites.front_default}
                                alt={`Next: ${nextPokemonData.name}`}
                            />
                        </Link>
                    )}
                </div>

            </div>
            <div className='more-info-stat'>
                <h2>Stats</h2>
                <ul className="stat-bars">
                    {stats.map((stat) => {
                        const percent = (stat.base_stat / MAX_STAT) * 100;

                        return (
                            <li key={stat.stat.name} className="stat-item">
                                <span className="stat-label">{stat.stat.name.toUpperCase()}</span>
                                <div className="stat-bar-container">
                                    <div
                                        className="stat-bar"
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: percent > 70 ? '#4caf50' : percent > 40 ? '#ffc107' : '#f44336',
                                        }}
                                    ></div>
                                </div>
                                <span className="stat-value">{stat.base_stat}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='more-info'>
                <h1>Moves</h1>

                <div className='how'>
                    <h1>By Leveling Up</h1>
                    <ul>
                        {categorizedMoves.levelUp.map((move, index) => (
                            <li key={index} className={isSTAB(move) ? 'stab' : ''}>
                                <h3>{move.move}</h3>
                                <strong>Learned at levels: {move.learnLevels.join(', ')}</strong>

                            </li>
                        ))}
                    </ul>
                </div>
                <div className='how'>
                    <h1>By TM</h1>
                    <ul>
                        {categorizedMoves.tm.map((move, index) => (
                            <li key={index} className={isSTAB(move) ? 'stab' : ''}>
                                <h3>{move.move}</h3>
                                <strong>Learned at levels: {move.learnLevels.join(', ')}</strong>

                            </li>
                        ))}
                    </ul>
                </div>
                <div className='how'>
                    <h1>By Egg</h1>
                    <ul>
                        {categorizedMoves.egg.map((move, index) => (
                            <li key={index} className={isSTAB(move) ? 'stab' : ''}>
                                <h3>{move.move}</h3>
                                <strong>Learned at levels: {move.learnLevels.join(', ')}</strong>

                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div >
    );
};

export default PokemonDetails;
