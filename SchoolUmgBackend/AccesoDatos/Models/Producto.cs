using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AccesoDatos.Models
{
    public class Producto
    {
        public int id_producto { get; set; }
        public string descripcion { get; set; }

        public int stock { get; set; }

        public decimal precio_venta {  get; set; }

        public int id_categoria { get; set; }

        public string fecha_ingreso { get; set; }


        public string fecha_caducidad { get; set; }



    }
}
