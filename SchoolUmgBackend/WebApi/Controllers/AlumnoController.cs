using Microsoft.AspNetCore.Mvc;
using AccesoDatos.Models;
using AccesoDatos.Operaciones;
using AccesoDatos.Context;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace WebApi.Controllers
{
    // Define la ruta base para los endpoints de este controlador.
    [Route("api")]
    [ApiController]
    public class AlumnoController : ControllerBase
    {
        // Instancia del objeto de acceso a datos para interactuar con la base de datos.
        private readonly AlumnoDAO alumnoDAO = new AlumnoDAO();

        // Obtiene una lista de alumnos que están matriculados en las asignaturas de un profesor.
        [HttpGet("getAlumnosProfesor")]
        public IActionResult getAlumnosProfesor(string usuario)
        {
            try
            {
                // Llama al método del DAO para obtener los alumnos del profesor.
                var result = alumnoDAO.seleccionarAlumnosProfesor(usuario);
                // Si la lista está vacía, devuelve un error 404.
                if (result == null || result.Count == 0)
                {
                    return NotFound("No se encontraron alumnos para el profesor especificado.");
                }
                // Si la operación es exitosa, devuelve un código 200 y los datos.
                return Ok(result);
            }
            catch (Exception ex)
            {
                // En caso de cualquier error, devuelve un error 500.
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }

        // Obtiene los detalles de un alumno por su ID.
        [HttpGet("getAlumnoId")]
        public IActionResult getAlumnoId(int id)
        {
            try
            {
                // Llama al método del DAO para obtener el alumno por su ID.
                var result = alumnoDAO.seleccionarId(id);
                // Si el alumno no se encuentra, devuelve un error 404.
                if (result == null)
                {
                    return NotFound($"No se encontró ningún alumno con el ID: {id}.");
                }
                // Devuelve el alumno con un código 200.
                return Ok(result);
            }
            catch (Exception ex)
            {
                // En caso de cualquier error, devuelve un error 500.
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }

        // Actualiza los datos de un alumno existente.
        [HttpPut("actualizarAlumno")]
        public IActionResult actualizarAlumno([FromBody] Alumno alumno)
        {
            try
            {
                // Valida que el objeto Alumno y su ID sean válidos.
                if (alumno == null || alumno.Id <= 0)
                {
                    return BadRequest("El alumno no es válido o su ID es incorrecto.");
                }
                // Llama al método del DAO para actualizar. Si el alumno no existe, el DAO lanzará una excepción.
                alumnoDAO.actualizar(alumno.Id, alumno.Dni, alumno.Nombre, alumno.Direccion, alumno.Edad, alumno.Email);
                // Si la operación es exitosa, devuelve un mensaje de éxito con código 200.
                return Ok("Alumno actualizado exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                // Captura el error específico si el alumno no existe.
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Captura cualquier otra excepción.
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el alumno: {ex.Message}");
            }
        }

        /// Inserta un nuevo alumno o lo matricula si ya existe.
        [HttpPost("insertarMatricular")]
        public IActionResult insertarMatricular([FromBody] Alumno alumno, int id_asig)
        {
            try
            {
                if (alumno == null || id_asig <= 0)
                {
                    return BadRequest("Los datos del alumno o el ID de la asignatura no son válidos.");
                }

                alumnoDAO.insertarYMatricular(alumno, id_asig);

                return Ok("Alumno insertado y matriculado exitosamente.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar y matricular al alumno: {ex.Message}");
            }
        }


        /// Elimina un alumno y todos sus datos relacionados (matrículas, calificaciones).
        [HttpDelete("eliminarAlumno")]
        public IActionResult eliminarAlumno(int id)
        {
            try
            {
                // Llama al método del DAO que maneja la eliminación en cascada.
                alumnoDAO.eliminarAlumno(id);
                // Si la operación es exitosa, devuelve un mensaje de confirmación.
                return Ok($"Alumno con ID {id} y sus datos relacionados eliminados exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                // Captura si el alumno no existe.
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                // Captura errores lógicos durante la eliminación, por ejemplo, en la transacción.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                // Captura cualquier otro error inesperado.
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error inesperado al eliminar el alumno: {ex.Message}");
            }
        }
    }
}