using AccesoDatos.Context;
using AccesoDatos.Models;
using System.Collections.Generic;
using System.Linq;

namespace AccesoDatos.Operaciones
{
    public class AsignaturaDAO
    {
        private readonly ProyectoContext contexto = new ProyectoContext();

        // Devuelve todas las asignaturas con solo id y nombre
        public List<Asignatura> seleccionarTodos()
        {
            return contexto.Asignaturas
                .Select(a => new Asignatura
                {
                    Id = a.Id,
                    Nombre = a.Nombre
                })
                .ToList();
        }
    }
}
