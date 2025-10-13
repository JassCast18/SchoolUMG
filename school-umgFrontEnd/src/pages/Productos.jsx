import React, { useEffect, useState } from "react";
import * as API from "../services/data";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import JSPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProducto, setCurrentProducto] = useState({
    id_producto: null,
    descripcion: "",
    stock: "",
    precio_venta: "",
    id_categoria: "",
    fecha_ingreso: "",
    fecha_caducidad: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // columnas disponibles para exportación
  const columnasDisponibles = [
    { key: "id_producto", label: "ID" },
    { key: "descripcion", label: "Descripción" },
    { key: "stock", label: "Stock" },
    { key: "precio_venta", label: "Precio Venta" },
    { key: "id_categoria", label: "Categoría" },
    { key: "fecha_ingreso", label: "Fecha Ingreso" },
    { key: "fecha_caducidad", label: "Fecha Caducidad" },
  ];

  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    columnasDisponibles.map((c) => c.key)
  );

  const fetchProductos = () => {
    setLoading(true);
    API.getProductos()
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Toast configuración
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  // Modal
  const handleAgregar = () => {
    setCurrentProducto({
      id_producto: null,
      descripcion: "",
      stock: "",
      precio_venta: "",
      id_categoria: "",
      fecha_ingreso: "",
      fecha_caducidad: "",
    });
    setModalOpen(true);
  };

  const handleEditar = (producto) => {
    setCurrentProducto({ ...producto });
    setModalOpen(true);
  };

  const handleEliminar = (id_producto) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        API.eliminarProducto({ id: id_producto })
          .then(() => {
            Swal.fire("Eliminado", "El producto fue eliminado", "success");
            fetchProductos();
          })
          .catch((err) => Swal.fire("Error", err.message, "error"));
      }
    });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const {
      id_producto,
      descripcion,
      stock,
      precio_venta,
      id_categoria,
      fecha_ingreso,
      fecha_caducidad,
    } = currentProducto;

    if (!descripcion || !stock || !precio_venta) {
      Swal.fire("Error", "Descripción, Stock y Precio son obligatorios", "warning");
      return;
    }

    if (id_producto) {
      API.actualizarProducto(currentProducto)
        .then(() => {
          setModalOpen(false);
          fetchProductos();
          Toast.fire({
            icon: "success",
            title: "Producto actualizado correctamente",
          });
        })
        .catch((err) => Swal.fire("Error", err.message, "error"));
    } else {
      API.insertarProducto(currentProducto)
        .then(() => {
          setModalOpen(false);
          fetchProductos();
          Toast.fire({
            icon: "success",
            title: "Producto insertado correctamente",
          });
        })
        .catch((err) => Swal.fire("Error", err.message, "error"));
    }
  };

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProductos = productos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  // Exportar
  const handleExport = (type) => {
    const dataToExport = productos.map((p) =>
      selectedColumns.reduce((obj, key) => {
        obj[key] = p[key] ?? "";
        return obj;
      }, {})
    );

    if (dataToExport.length === 0) {
      Swal.fire("Aviso", "No hay datos para exportar", "info");
      return;
    }

    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      XLSX.writeFile(wb, "Productos.xlsx");
    } else {
      const doc = new JSPDF();
      doc.setFontSize(16);
      doc.text("Listado de Productos", 14, 20);
      const head = columnasDisponibles
        .filter((c) => selectedColumns.includes(c.key))
        .map((c) => c.label);
      const body = dataToExport.map((p) =>
        selectedColumns.map((key) => String(p[key] ?? ""))
      );
      autoTable(doc, {
        head: [head],
        body,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save("Productos.pdf");
    }

    setIsColumnsModalOpen(false);
  };

  const toggleColumn = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Productos</h4>
        <div>
          <button className="btn btn-success me-2" onClick={handleAgregar}>
            Agregar Producto
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsColumnsModalOpen(true)}
          >
            Exportar
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <>
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                {columnasDisponibles.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProductos.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.stock}</td>
                  <td>{p.precio_venta}</td>
                  <td>{p.id_categoria}</td>
                  <td>{p.fecha_ingreso}</td>
                  <td>{p.fecha_caducidad}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(p.id_producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Modal de agregar/editar */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleModalSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentProducto.id_producto ? "Editar Producto" : "Agregar Producto"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentProducto.descripcion}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        descripcion: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentProducto.stock}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        stock: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Precio Venta</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentProducto.precio_venta}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        precio_venta: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
  <label>Categoría (ID)</label>
  <select
    className="form-control"
    value={currentProducto.id_categoria}
    onChange={(e) =>
      setCurrentProducto({
        ...currentProducto,
        id_categoria: e.target.value,
      })
    }
    required
  >
    <option value="">Seleccione una categoría</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
  </select>
</div>

            
                <div className="mb-3">
                  <label>Fecha Ingreso</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentProducto.fecha_ingreso}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        fecha_ingreso: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Fecha Caducidad</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentProducto.fecha_caducidad}
                    onChange={(e) =>
                      setCurrentProducto({
                        ...currentProducto,
                        fecha_caducidad: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de columnas exportación */}
      {isColumnsModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Columnas a Exportar</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsColumnsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {columnasDisponibles.map((col) => (
                  <div className="form-check" key={col.key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={col.key}
                      checked={selectedColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                    />
                    <label className="form-check-label" htmlFor={col.key}>
                      {col.label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => handleExport("excel")}
                >
                  Exportar a Excel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleExport("pdf")}
                >
                  Exportar a PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
