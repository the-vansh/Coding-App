import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navigate() {
    const navigate = useNavigate();
    
    const performLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <nav>
            <h2>lets code!</h2>
            <ul>
              {!localStorage.getItem('token') ?
                 <li><h3 style={{color:'white'}}>Welcome</h3></li>:<ul><li><Link to='/editor'>Editor</Link></li> <li><Link to='/aisupport'>Ai-Support</Link></li> <li><Link to='/myfile'>My-File</Link></li>  <li><button onClick={performLogout} id='Deletebtn'> Logout</button></li>  </ul> 
              }
            </ul>
        </nav>
    );
}
