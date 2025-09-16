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
    }
}
