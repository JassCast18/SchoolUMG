using AccesoDatos.Context;
using AccesoDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Operaciones
{
    public class ProfesorDAO
    {
        public ProyectoContext contexto = new ProyectoContext();

        public Profesor login(string usuario, string pass)
        {
            var profe = contexto.Profesors.Where(p=> p.Usuario == usuario && p.Pass == pass).FirstOrDefault();
            return profe;
        }

        public List<Profesor> getProfesores()
        {
            return contexto.Profesors.ToList();
        }

        public Profesor getProfesorID(string usuario)
        {
            return contexto.Profesors.FirstOrDefault(p => p.Usuario == usuario);
        }
        
        public void insertarProfesor(Profesor profesor)
        {
            contexto.Profesors.Add(profesor);
            contexto.SaveChanges();
        }

        public void actualizarProfesor(Profesor profesor)
        {
            var profe = contexto.Profesors.FirstOrDefault(p => p.Usuario == profesor.Usuario);
            if (profe != null)
            {
                profe.Nombre = profesor.Nombre;
                profe.Email = profesor.Email;
                profe.Pass = profesor.Pass;
                contexto.SaveChanges();
            }
        }

        public void eliminarProfesor(string usuario)
        {
            var profe = contexto.Profesors.FirstOrDefault(p => p.Usuario == usuario);
            if (profe != null)
            {
                contexto.Profesors.Remove(profe);
                contexto.SaveChanges();
            }
        }
    }
}
