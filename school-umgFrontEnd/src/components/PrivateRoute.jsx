import {Navigate} from 'react-router-dom';

export const PrivateRoute = ({children}) => {
  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return children;
};


 
