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
                {
                    return NotFound("No se encontraron asignaturas.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }


        [HttpGet("getAllAsignaturas")]
        public IActionResult getProfesores()
        {
            try
            {
                var lista = asignaturaDAO.getAsignaturas();
                return Ok(lista);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("getAsignaturaId/{id}")]
        public IActionResult getProfesorID(int id)
        {

                try
                {
                    var lista = asignaturaDAO.seleccionarId(id);
                    if (lista == null)
                    {
                    return NotFound($"No se encontro la asignatura con ID {id}");
                    }
                    return Ok(lista);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno al obtener asignatura: {ex.Message}");
                }
           
        }

        [HttpPost("insertarAsignatura")]
        public IActionResult insertarProfesor([FromBody] Asignatura profesor)
        {
            try {
                asignaturaDAO.insertar(profesor);
                return Ok("Asignatura insertado Correctamente");
            } catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno al insertar asignatura: {ex.Message}");

            }
        }

        [HttpPut("ActualizarAsignatura")]
        public IActionResult actualizarProfesor([FromQuery]int id, [FromBody] Asignatura profesor)
        {

            try
            {
                var existingProfesor = asignaturaDAO.seleccionarId(id);
                if (existingProfesor == null)
                {
                    return NotFound("Asignatura no encontrado");
                }
                asignaturaDAO.actualizar(profesor);
                return Ok("Asignatura a correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno al actualizar asignatura: {ex.Message}");
            }


        }
        [HttpDelete("eliminarAsignatura")]
        public IActionResult eliminarProfesor([FromQuery] int id)
        {
            try
            {
                var existingProfesor = asignaturaDAO.seleccionarId(id);
                if (existingProfesor == null)
                {
                    return NotFound("Asignatura no encontrado");
                }
                asignaturaDAO.eliminarAsignatura(id);
                return Ok("Asignatura eliminado correctamente");

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno al eliminar asignatura: {ex.Message}");
            }
        }


    }
}
