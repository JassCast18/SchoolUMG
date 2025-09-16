using System;
using System.Collections.Generic;

namespace AccesoDatos.Models;

public partial class Calificacion
{
    public int Id { get; set; }

    public string Descripcion { get; set; } = null!;

    public decimal Nota { get; set; }

    public decimal Porcentaje { get; set; }

    public int MatriculaId { get; set; }

    public virtual Matricula? Matricula { get; set; } = null!;
}
