using AccesoDatos.Context;
using AccesoDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Operaciones
{
    public class AlumnosPorAsignaturaDAO
    {
        public ProyectoContext contexto= new ProyectoContext();

        public List<AlumnosPorAsignatura> ObtenerTodos()
        {
            return contexto.Set<AlumnosPorAsignatura>().ToList();
        }
    }
}
