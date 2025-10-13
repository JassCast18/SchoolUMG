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

        public List<Asignatura> getAsignaturas() => contexto.Asignaturas.ToList();


        // Busca un Asignatura por su ID.
        public Asignatura seleccionarId(int id) => contexto.Asignaturas.Where(a => a.Id == id).FirstOrDefault();


        // Inserta un nuevo Asignatura en la base de datos.
        public void insertar(Asignatura asignatura)
        {
            // Agrega el nuevo objeto al contexto y guarda los cambios en la base de datos.
            contexto.Asignaturas.Add(asignatura);
            contexto.SaveChanges();
        }

        // Actualiza los datos de un Asignatura.
        public void actualizar(Asignatura asignatura)
        {
            // Busca el Asignatura por su ID.
            var AsignaturaExistente = seleccionarId(asignatura.Id);
            if (AsignaturaExistente != null)
            {
                // Lanza una excepción si no se encuentra el Asignatura.
                AsignaturaExistente.Nombre = asignatura.Nombre;
                AsignaturaExistente.Creditos = asignatura.Creditos;
                AsignaturaExistente.Profesor = asignatura.Profesor;
                contexto.SaveChanges();
            }

           
        }


        // Elimina un Asignatura y todos sus datos relacionados (matrículas y calificaciones) en una transacción.
        public void eliminarAsignatura(int id)
        {
            // Inicia una transacción para asegurar que todas las eliminaciones se hagan o se reviertan.
            var asignatura = seleccionarId(id);
            if(asignatura != null)
            {
                contexto.Asignaturas.Remove(asignatura);
                contexto.SaveChanges();
            }
        }

    }


}

