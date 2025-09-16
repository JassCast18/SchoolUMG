import {useNavigate} from 'react-router-dom';
import logoUMG from '../assets/logoUMG.png';

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };
  return (
    <header className="navbar navbar-dark bg-primary px-3 fixed-top d-flex justify-content-between">
      <div className="d-flex align-items-center">
    <img src={logoUMG} alt="Logo UMG" 
    style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'contain' }}/>
    <h5 className="text-white mb-0">Sistema UMG</h5>
      </div>
      <button className="btn btn-light" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  );
}
