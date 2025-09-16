using Microsoft.AspNetCore.Mvc;
using AccesoDatos.Operaciones;
using AccesoDatos.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace WebApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class AsignaturaController : ControllerBase
    {
        private readonly AsignaturaDAO asignaturaDAO = new AsignaturaDAO();

        // GET api/getAsignaturas
        [HttpGet("getAsignaturas")]
        public IActionResult getAsignaturas()
        {
            try
            {
                var result = asignaturaDAO.seleccionarTodos();
                if (result == null || result.Count == 0)
                    return NotFound("No se encontraron asignaturas.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
