using AccesoDatos.Models;
using AccesoDatos.Operaciones;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WebApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class CalificacionController : ControllerBase
    {
        // Instancia interna del DAO para interactuar con la base de datos
        private readonly CalificacionDAO _calificacionDAO = new CalificacionDAO();

        // Obtiene todas las calificaciones de una matrícula específica.
        [HttpGet("getCalificacionId/{idMatricula}")]
        public ActionResult<List<Calificacion>> getCalificacionId(int idMatricula)
        {
            var calificaciones = _calificacionDAO.SeleccionarPorMatricula(idMatricula);

            if (calificaciones == null || calificaciones.Count == 0)
                return NotFound($"No se encontraron calificaciones para la matrícula {idMatricula}");

            return Ok(calificaciones);
        }

        // Inserta una nueva calificación.
        [HttpPost("insertCalificacion")]
        public ActionResult<Calificacion> insertCalificacion([FromBody] Calificacion calificacion)
        {
            if (calificacion == null)
                return BadRequest("La calificación es obligatoria.");

            try
            {
                var nueva = _calificacionDAO.AgregarCalificacion(calificacion);
                return CreatedAtAction(nameof(getCalificacionId), new { idMatricula = nueva.MatriculaId }, nueva);
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        // Actualiza una calificación existente.
        [HttpPut("actualizarCalificacion/{id}")]
        public ActionResult<Calificacion> actualizarCalificacion(int id, [FromBody] Calificacion calificacion)
        {
            if (calificacion == null)
                return BadRequest("La calificación es obligatoria.");

            calificacion.Id = id; // Asegurarse de que la calificación tenga el ID correcto

            try
            {
                var actualizado = _calificacionDAO.ActualizarCalificacion(calificacion);
                if (actualizado == null)
                    return NotFound($"No existe la calificación con ID {id}");

                return Ok(actualizado);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        // Elimina una calificación por su ID.
        [HttpDelete("eliminarCalificacion/{id}")]
        public IActionResult eliminarCalificacion(int id)
        {
            var eliminado = _calificacionDAO.EliminarCalificacion(id);

            if (!eliminado)
                return NotFound($"No existe la calificación con ID {id}");

            return NoContent(); // Eliminación exitosa
        }

        [HttpGet("calificaciones/profesor/{usuario}")]
        public ActionResult<List<CalificacionProfesor>> GetPorProfesor(string usuario)
        {
            var calificaciones = _calificacionDAO.SeleccionarPorProfesor(usuario);
            if (calificaciones == null || !calificaciones.Any())
                return NotFound($"No se encontraron calificaciones para el profesor {usuario}");
            return Ok(calificaciones);
        }
    }
}
