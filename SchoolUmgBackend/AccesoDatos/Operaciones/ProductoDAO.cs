using AccesoDatos.Context;
using AccesoDatos.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AccesoDatos.Operaciones
{
    public class ProductoDAO
    {

        // Instancia del contexto de la base de datos (Entity Framework).
        public ProyectoContext contexto = new ProyectoContext();


        //Selecciona todos los alumnos de la base de datos.
        public List<Producto> seleccionarTodos() => contexto.Productos.ToList();


        // Busca un alumno por su ID.
        public Producto seleccionarId(int id_producto) => contexto.Productos.Where(a => a.id_producto == id_producto).FirstOrDefault();


        // Inserta un nuevo alumno en la base de datos.
        public void insertar(string descripcion, int stock, decimal precio_venta, int id_categoria, string fecha_ingreso, string fecha_caducidad)
        {

            // Crea un nuevo objeto Alumno con los datos proporcionados.
            Producto alumno = new Producto
            {
                descripcion = descripcion,
                stock = stock,
                precio_venta = precio_venta,
                id_categoria = id_categoria,
                fecha_ingreso = fecha_ingreso,
                fecha_caducidad = fecha_caducidad
            };

            // Agrega el nuevo objeto al contexto y guarda los cambios en la base de datos.
            contexto.Productos.Add(alumno);
            contexto.SaveChanges();
        }

        // Actualiza los datos de un alumno.
        public void actualizar(int id_producto, string descripcion, int stock, decimal precio_venta, int id_categoria, string fecha_ingreso, string fecha_caducidad)
        {
            // Busca el alumno por su ID.
            var alumno = seleccionarId(id_producto);
            if (alumno == null)
            {
                // Lanza una excepción si no se encuentra el alumno.
                throw new KeyNotFoundException("No se encontró el producto con el ID proporcionado.");
            }

            // Actualiza las propiedades del objeto encontrado.
            alumno.descripcion = descripcion;
            alumno.stock = stock;
            alumno.precio_venta = precio_venta;
            alumno.id_categoria = id_categoria;
            alumno.fecha_ingreso = fecha_ingreso;
            alumno.fecha_caducidad = fecha_caducidad;

            // Guarda los cambios en la base de datos.
            contexto.SaveChanges();
        }

     

        // Elimina un alumno y todos sus datos relacionados (matrículas y calificaciones) en una transacción.
        public void eliminar(int id_producto)
        {
            // Inicia una transacción para asegurar que todas las eliminaciones se hagan o se reviertan.
            using (var transaction = contexto.Database.BeginTransaction())
            {
                try
                {
                    // Busca el alumno.
                    var alumno = contexto.Productos.FirstOrDefault(a => a.id_producto == id_producto);
                    if (alumno == null)
                    {
                        throw new KeyNotFoundException("No se encontró el Producto para eliminar.");
                    }


                    // Elimina el alumno.
                    contexto.Productos.Remove(alumno);

                    // Guarda los cambios y confirma la transacción.
                    contexto.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // En caso de error, revierte la transacción para no dejar datos inconsistentes.
                    transaction.Rollback();
                    throw new InvalidOperationException("Error al eliminar el Producto y sus datos relacionados.", ex);
                }
            }
        }

       
        
    }
}
