using AccesoDatos.Context;
using AccesoDatos.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AccesoDatos.Operaciones
{
    public class CalificacionDAO
    {
        private readonly ProyectoContext _contexto;

        // Constructor que inicializa el contexto de base de datos.
        public CalificacionDAO()
        {
            _contexto = new ProyectoContext();
        }

        // Obtiene todas las calificaciones asociadas a una matrícula específica.
        public List<Calificacion> SeleccionarPorMatricula(int idMatricula)
        {
            return _contexto.Calificacions
                            .Where(c => c.MatriculaId == idMatricula)
                            .AsNoTracking()
                            .ToList();
        }

        // Inserta una nueva calificación en la base de datos.
        public Calificacion AgregarCalificacion(Calificacion calificacion)
        {
            // Validar que la matrícula exista antes de insertar
            bool existeMatricula = _contexto.Matriculas.Any(m => m.Id == calificacion.MatriculaId);
            if (!existeMatricula)
                throw new ArgumentException($"No existe la matrícula con ID {calificacion.MatriculaId}");

            _contexto.Calificacions.Add(calificacion);
            _contexto.SaveChanges();
            return calificacion;
        }

        // Actualiza una calificación existente en la base de datos.
        public Calificacion ActualizarCalificacion(Calificacion calificacion)
        {
            var existente = _contexto.Calificacions.Find(calificacion.Id);
            if (existente == null)
                return null; // No existe la calificación

            // Actualizar campos
            existente.Descripcion = calificacion.Descripcion;
            existente.Nota = calificacion.Nota;
            existente.Porcentaje = calificacion.Porcentaje;
            existente.MatriculaId = calificacion.MatriculaId;

            _contexto.SaveChanges();
            return existente;
        }

        // Elimina una calificación según su ID.
        public bool EliminarCalificacion(int id)
        {
            var calificacion = _contexto.Calificacions.Find(id);
            if (calificacion == null)
                return false;

            _contexto.Calificacions.Remove(calificacion);
            _contexto.SaveChanges();
            return true;
        }

        // Obtiene calificaciones de alumnos filtrando por profesor de la asignatura
        public List<CalificacionProfesor> SeleccionarPorProfesor(string profesorUsuario)
        {
            var query = _contexto.Calificacions
                .Include(c => c.Matricula)
                    .ThenInclude(m => m.Alumno)
                .Include(c => c.Matricula)
                    .ThenInclude(m => m.Asignatura)
                        .ThenInclude(a => a.ProfesorNavigation)  // usamos la navegación
                .Where(c => c.Matricula.Asignatura.ProfesorNavigation.Usuario == profesorUsuario)
                .Select(c => new CalificacionProfesor
                {
                    Id = c.Id,
                    Descripcion = c.Descripcion,
                    Nota = (double)c.Nota,
                    MatriculaId = c.MatriculaId,
                    AlumnoDni = c.Matricula.Alumno.Dni,
                    AlumnoNombre = c.Matricula.Alumno.Nombre
                });

            return query.ToList();
        }
    }
}
