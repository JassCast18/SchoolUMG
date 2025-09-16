using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.Models
{
    public class CalificacionProfesor
    {
        public int Id { get; set; }             // Id de la calificación
        public string Descripcion { get; set; } // Descripción de la calificación
        public double Nota { get; set; }        // Nota
        public int MatriculaId { get; set; }    // Id de la matrícula
        public string AlumnoDni { get; set; }   // DNI del alumno
        public string AlumnoNombre { get; set; }// Nombre del alumno
    }
}

