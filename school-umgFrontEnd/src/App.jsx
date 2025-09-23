import { Routes, Route } from 'react-router-dom'
import { Login } from './Login'
import { DashboardLayout } from './pages/DashboardLayout'
import { Inicio } from './pages/Inicio'
import { Alumnos } from './pages/Alumnos'
import { Calificaciones } from './pages/Calificaciones'
import { PrivateRoute } from './components/PrivateRoute'
import {Profesores} from './pages/Profesores'

function App() {

  return (
    <Routes>
      {/* Ruta publica */}
      <Route path="/" element={<Login />} />

      {/* Ruta Protegidas */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Inicio />} />
        <Route path="profesores" element={<Profesores />} />
        <Route path="alumnos" element={<Alumnos />} />
        <Route path="calificaciones" element={<Calificaciones />} />
      </Route>

    </Routes>
  )
}

export default App
