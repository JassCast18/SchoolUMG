using AccesoDatos.Context;
using AccesoDatos.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AccesoDatos.Operaciones
{
    public class AlumnoDAO
    {
        // Instancia del contexto de la base de datos (Entity Framework).
        public ProyectoContext contexto = new ProyectoContext();

       
        //Selecciona todos los alumnos de la base de datos.
        public List<Alumno> seleccionarTodos() => contexto.Alumnos.ToList();

        
        // Busca un alumno por su ID.
        public Alumno seleccionarId(int id) => contexto.Alumnos.Where(a => a.Id == id).FirstOrDefault();

        
        // Busca un alumno por su número de DNI.
        public Alumno seleccionarPorDni(string dni) => contexto.Alumnos.Where(a => a.Dni.Equals(dni)).FirstOrDefault();

        
        // Inserta un nuevo alumno en la base de datos.
        public void insertar(string dni, string nombre, string direccion, int edad, string email)
        {
            // Valida que el alumno no exista antes de la inserción para evitar duplicados.
            if (seleccionarPorDni(dni) != null)
            {
                throw new InvalidOperationException("El alumno con ese DNI ya existe.");
            }

            // Crea un nuevo objeto Alumno con los datos proporcionados.
            Alumno alumno = new Alumno
            {
                Dni = dni,
                Nombre = nombre,
                Direccion = direccion,
                Edad = edad,
                Email = email
            };

            // Agrega el nuevo objeto al contexto y guarda los cambios en la base de datos.
            contexto.Alumnos.Add(alumno);
            contexto.SaveChanges();
        }

        // Actualiza los datos de un alumno.
        public void actualizar(int id, string dni, string nombre, string direccion, int edad, string email)
        {
            // Busca el alumno por su ID.
            var alumno = seleccionarId(id);
            if (alumno == null)
            {
                // Lanza una excepción si no se encuentra el alumno.
                throw new KeyNotFoundException("No se encontró el alumno con el ID proporcionado.");
            }

            // Actualiza las propiedades del objeto encontrado.
            alumno.Dni = dni;
            alumno.Nombre = nombre;
            alumno.Direccion = direccion;
            alumno.Edad = edad;
            alumno.Email = email;

            // Guarda los cambios en la base de datos.
            contexto.SaveChanges();
        }

        // Inserta un nuevo alumno si no existe y lo matricula en una asignatura.
        public void insertarYMatricular(Alumno alumnoParaMatricular, int id_asig)
        {
            using var transaction = contexto.Database.BeginTransaction();
            try
            {
                // Insertar alumno en DB
                contexto.Alumnos.Add(alumnoParaMatricular);
                contexto.SaveChanges();

                // Validar asignatura
                var asignaturaExiste = contexto.Asignaturas.Any(a => a.Id == id_asig);
                if (!asignaturaExiste)
                    throw new InvalidOperationException($"La asignatura con Id {id_asig} no existe.");

                // Insertar matrícula-
                var nuevaMatricula = new Matricula
                {
                    AlumnoId = alumnoParaMatricular.Id,  // ahora tiene un valor real
                    AsignaturaId = id_asig
                };

                contexto.Matriculas.Add(nuevaMatricula);
                contexto.SaveChanges();

                transaction.Commit();
            }
            catch (DbUpdateException dbEx)
            {
                transaction.Rollback();
                var inner = dbEx.InnerException?.Message;
                throw new InvalidOperationException(
                    $"Error de base de datos al insertar y matricular al alumno. Detalle: {inner}", dbEx);
            }
        }


        // Elimina un alumno y todos sus datos relacionados (matrículas y calificaciones) en una transacción.
        public void eliminarAlumno(int id)
        {
            // Inicia una transacción para asegurar que todas las eliminaciones se hagan o se reviertan.
            using (var transaction = contexto.Database.BeginTransaction())
            {
                try
                {
                    // Busca el alumno.
                    var alumno = contexto.Alumnos.FirstOrDefault(a => a.Id == id);
                    if (alumno == null)
                    {
                        throw new KeyNotFoundException("No se encontró el alumno para eliminar.");
                    }

                    // Elimina calificaciones asociadas.
                    var calificaciones = contexto.Calificacions.Where(c => contexto.Matriculas.Any(m => m.AlumnoId == id && m.Id == c.MatriculaId));
                    contexto.Calificacions.RemoveRange(calificaciones);

                    // Elimina matrículas del alumno.
                    var matriculas = contexto.Matriculas.Where(m => m.AlumnoId == id);
                    contexto.Matriculas.RemoveRange(matriculas);

                    // Elimina el alumno.
                    contexto.Alumnos.Remove(alumno);

                    // Guarda los cambios y confirma la transacción.
                    contexto.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // En caso de error, revierte la transacción para no dejar datos inconsistentes.
                    transaction.Rollback();
                    throw new InvalidOperationException("Error al eliminar el alumno y sus datos relacionados.", ex);
                }
            }
        }

        public List<AlumnoProfesor> seleccionarAlumnosProfesor(string usuario)
        {
            try
            {
                // Valida el parámetro de entrada. Si es nulo o vacío.
                if (string.IsNullOrEmpty(usuario))
                {
                    // Lanza una excepción si el nombre de usuario es nulo o vacío, indicando que es un error del cliente.
                    throw new ArgumentNullException(nameof(usuario), "El nombre de usuario del profesor no puede ser nulo o vacío.");
                }

                var query = from a in contexto.Alumnos
                            join m in contexto.Matriculas on a.Id equals m.AlumnoId
                            join asig in contexto.Asignaturas on m.AsignaturaId equals asig.Id
                            where asig.Profesor == usuario
                            select new AlumnoProfesor
                            {
                                Id = a.Id,
                                Dni = a.Dni,
                                Nombre = a.Nombre,
                                Direccion = a.Direccion,
                                Edad = a.Edad,
                                Email = a.Email,
                                Asignatura = asig.Nombre
                            };

               // Si la consulta no devuelve resultados, se retornará una lista vacía.
                return query.ToList();
            }
            catch (DbUpdateException dbEx)
            {
                // Captura excepciones específicas de Entity Framework (problemas con la base de datos).
                throw new InvalidOperationException("Error de base de datos al seleccionar alumnos del profesor.", dbEx);
            }
            catch (Exception ex)
            {
                // Captura cualquier otra excepción genérica.
                throw new Exception("Ocurrió un error inesperado al seleccionar alumnos del profesor.", ex);
            }
        }
    }
}