import { Link } from 'react-router-dom'


const Home = () => {
    return (
        <div className="home">
            <h1>Hello Trainer!</h1>
            <Link to="/pokedex">Open Pokedex</Link>
        </div>
    )
}
export default Home;
