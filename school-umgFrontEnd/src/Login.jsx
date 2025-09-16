import {useState} from 'react'
import * as API from './services/data';
import imagen from './assets/login.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Login = () => {
  const [teacher, setTeacher] = useState({usuario: '', password: ''});
  const navigate = useNavigate();

  async function handleSubmit (e) {
    e.preventDefault();
    
    const form = e.target;

    if(!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    try {
      const response = await API.login(teacher.usuario, teacher.password);
      if(response) {
        localStorage.setItem('usuario', teacher.usuario);
        navigate('/dashboard');
      }else{
        Swal.fire({
          icon: 'error',
          text: 'Usuario o contraseña incorrectos',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la autenticacion',
        text: error.message,
      });
    }
  };

  return (
    <div className='container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-dark'>
      <div className='card p-4 shadow-lg bg-white' style={{maxWidth: '420px', width: '100%', borderRadius: '12px'}}>
        <div className='text-center mb-3'>
          <img src={imagen} alt="Login" className='img-fluid mb-2' style={{width: '90px', height: '90px', objectFit: 'contain'}} />
          <h2 className='h5 mb-0'>Iniciar Sesión</h2>
        </div>
        <form id='formulario' onSubmit={handleSubmit} noValidate className='needs-validation'>
          <div className='mb-3'>
            <label htmlFor='usuario' className='form-label'>Usuario:</label>
            <input
              type='text'
              className='form-control'
              id='usuario'
              value={teacher.usuario}
              onChange={(e) => setTeacher({...teacher, usuario: e.target.value})}
              autoComplete='username'
              required
            />
            <div className='invalid-feedback'>
              Por favor ingresa tu usuario.
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor='pass' className='form-label'>Contraseña:</label>
            <input
              type='password'
              className='form-control'
              id='pass'
              value={teacher.password}
              onChange={(e) => setTeacher({...teacher, password: e.target.value})}
              autoComplete='current-password'
              required
            />
            <div className='invalid-feedback'>
              Por favor ingresa tu contraseña.
            </div>
          </div>
          <button type='submit' id='enviar' className='btn btn-primary w-100'>Iniciar Sesión</button>
        </form>
      </div>
    </div>
  )
}
