using AccesoDatos.Models;
using AccesoDatos.Operaciones;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class ProductoController : ControllerBase
    {

        // Instancia del objeto de acceso a datos para interactuar con la base de datos.
        private readonly ProductoDAO alumnoDAO = new ProductoDAO();

        // GET api/getAsignaturas
        [HttpGet("getProductos")]
        public IActionResult getAsignaturas()
        {
            try
            {
                var result = alumnoDAO.seleccionarTodos();
                if (result == null || result.Count == 0)
                    return NotFound("No se encontraron productos.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error interno del servidor: {ex.Message}");
            }
        }

        // Obtiene todas las calificaciones de una matrícula específica.
        [HttpGet("getProductosId/{id_producto}")]
        public ActionResult<List<Calificacion>> getCalificacionId(int id_producto)
        {
            var calificaciones = alumnoDAO.seleccionarId(id_producto);

            if (calificaciones == null)
                return NotFound($"No se encontraron productos con el id: {id_producto}");

            return Ok(calificaciones);
        }

        
        [HttpPut("producto/{id_producto}")]
        public IActionResult actualizarProfesor(int id_producto, [FromBody] Producto producto)
        {

            var existingProfesor = alumnoDAO.seleccionarId(id_producto);
            if (existingProfesor == null)
            {
                return NotFound("producto no encontrado");
            }
            alumnoDAO.actualizar(producto.id_producto, producto.descripcion, producto.stock, producto.precio_venta, producto.id_categoria, producto.fecha_ingreso, producto.fecha_caducidad);
            return Ok("Producto actualizado correctamente");
        }


        /// Inserta un nuevo alumno o lo matricula si ya existe.
        [HttpPost("insertarProducto")]
        public IActionResult insertarMatricular([FromBody] Producto producto)
        {
            try
            {
                if (producto == null )
                {
                    return BadRequest("Los datos del producto no son válidos.");
                }

                alumnoDAO.insertar( producto.descripcion, producto.stock, producto.precio_venta, producto.id_categoria, producto.fecha_ingreso, producto.fecha_caducidad);

                return Ok("Producto insertado exitosamente.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al insertar al producto: {ex.Message}");
            }
        }


        /// Elimina un alumno y todos sus datos relacionados (matrículas, calificaciones).
        [HttpDelete("eliminarProducto/{id_producto}")]
        public IActionResult eliminarAlumno(int id_producto)
        {
            try
            {
                var existingProfesor = alumnoDAO.seleccionarId(id_producto);
                if (existingProfesor == null)
                {
                    return NotFound("Producto no encontrado");
                }
                // Llama al método del DAO que maneja la eliminación en cascada.
                alumnoDAO.eliminar(id_producto);
                // Si la operación es exitosa, devuelve un mensaje de confirmación.
                return Ok($"Producto con ID {id_producto} y sus datos relacionados eliminados exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                // Captura si el alumno no existe.
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                // Captura errores lógicos durante la eliminación, por ejemplo, en la transacción.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                // Captura cualquier otro error inesperado.
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error inesperado al eliminar el producto: {ex.Message}");
            }
        }

    }
}
