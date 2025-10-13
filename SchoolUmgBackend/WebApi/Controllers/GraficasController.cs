using AccesoDatos.Operaciones;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class GraficasController : ControllerBase
    {
        private readonly AlumnosPorAsignaturaDAO alumnosPorAsignaturaDAO = new AlumnosPorAsignaturaDAO();
        private readonly DistribucionCalificacionesDAO distribucionDAO = new DistribucionCalificacionesDAO();

        [HttpGet("getAlumnosPorAsignatura")]
        public IActionResult GetAlumnosPorAsignatura()
        {
         try
            {
                var result = alumnosPorAsignaturaDAO.ObtenerTodos();
                if (result == null || result.Count == 0)
                {
                    return NotFound("No se encontraron datos de alumnos por asignatura.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getDistribucionCalificaciones")]
        public IActionResult GetDistribucionCalificaciones()
        {
            try
            {
                var datos = distribucionDAO.ObtenerTodos();
                if (datos == null || !datos.Any())
                {
                    return NotFound("No se encontraron datos de calificaciones");
                }
                var distribucion = new
                {
                    A= datos.Count(d => d.NotaFinal >= 90 && d.NotaFinal <= 100),
                    B = datos.Count(d => d.NotaFinal >= 80 && d.NotaFinal <= 90),
                    C = datos.Count(d => d.NotaFinal >= 70 && d.NotaFinal <= 80),
                    D = datos.Count(d => d.NotaFinal >= 60 && d.NotaFinal <= 70),
                    F = datos.Count(d => d.NotaFinal <= 60),
                    
                };
                return Ok(distribucion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
