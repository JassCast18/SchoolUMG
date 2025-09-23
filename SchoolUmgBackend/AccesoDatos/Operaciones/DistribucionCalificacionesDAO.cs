using AccesoDatos.Context;
using AccesoDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Operaciones
{
    public class DistribucionCalificacionesDAO
    {
        private ProyectoContext contexto = new ProyectoContext();

        public List<DistribucionCalificaciones> ObtenerTodos()
        {
            return contexto.DistribucionCalificaciones.ToList();
        }
    }
}
