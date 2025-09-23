using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Models
{
    public class AlumnosPorAsignatura
    {
        public int IdAsignatura { get; set; }
        public string NombreAsignatura { get; set; }
        public int TotalAlumnos { get; set; }
    }
}
