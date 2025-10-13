using Microsoft.AspNetCore.Mvc;
using AccesoDatos.Operaciones;
using AccesoDatos.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AccesoDatos.Models;
using System.Diagnostics.Eventing.Reader;

namespace WebApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class ProfesorController : ControllerBase
    {
        public ProfesorDAO profesorDAO = new ProfesorDAO();

        [HttpPost("autenticacion")]
        public string login([FromBody] Profesor profe)
        {
            var profesor = profesorDAO.login(profe.Usuario, profe.Pass);

            if(profesor != null) 
            {
                return profesor.Usuario;
            }
            else {
                    return null;
            }
        }

        [HttpGet("profesores")]
        public ActionResult<List<Profesor>> getProfesores()
        {
            return profesorDAO.getProfesores();
        }

        [HttpGet("profesor/{usuario}")]
        public ActionResult<Profesor> getProfesorID(string usuario)
        {
            var profesor = profesorDAO.getProfesorID(usuario);
            if (profesor == null)
            {
                return NotFound();
            }
            return profesor;
        }

        [HttpPost("profesor")]
        public IActionResult insertarProfesor([FromBody] Profesor profesor)
        {
            
            profesorDAO.insertarProfesor(profesor);
            return Ok("Profesor insertado Correctamente");
        }

        [HttpPut("profesor/{usuario}")]
        public IActionResult actualizarProfesor(string usuario, [FromBody] Profesor profesor)
        {
           
            var existingProfesor = profesorDAO.getProfesorID(usuario);
            if (existingProfesor == null)
            {
                return NotFound("Profesor no encontrado");
            }
            profesorDAO.actualizarProfesor(profesor);
            return Ok("Profesor actualizado correctamente");
        }
        [HttpDelete("profesor/{usuario}")]
        public IActionResult eliminarProfesor(string usuario)
        {
            var existingProfesor = profesorDAO.getProfesorID(usuario);
            if (existingProfesor == null)
            {
                return NotFound("Profesor no encontrado");
            }
            profesorDAO.eliminarProfesor(usuario);
            return Ok("Profesor eliminado correctamente");
        }
    }
}
