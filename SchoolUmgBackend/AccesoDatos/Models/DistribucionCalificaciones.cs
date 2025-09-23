using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Models
{
    public class DistribucionCalificaciones
    {
        public int Matriculaid { get; set; }
        public int Alumnoid { get; set; }
        public string NombreAlumno { get; set; }
        public decimal NotaFinal { get; set; }

    }
}
