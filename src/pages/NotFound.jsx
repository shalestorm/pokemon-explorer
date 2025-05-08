import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div>
            <h1>Whoa there trainer</h1>
            <h3>Looks like you got lost</h3>
            <Link to='/'>Head back home</Link>
        </div>
    )
}
export default NotFound;
