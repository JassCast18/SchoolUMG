import React, { useEffect, useState } from 'react';
import * as API from "../services/data";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import JSPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Asignaturas = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentAsignatura, setCurrentAsignatura] = useState({
        id: null,
        nombre: "",
        creditos: "",
        profesor: ""
    });

    const [profesores, setProfesores] = useState([]);
    

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    //columnas disponibles para exportación
    const columnasDisponibles = [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "creditos", label: "Créditos" },
        { key: "profesor", label: "Profesor" },
    ];

    const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState(
        columnasDisponibles.map((c) => c.key)
    );

    const fetchAsignaturas = () => {
        setLoading(true);
        API.getAllAsignaturas()
            .then((data) => {
                setAsignaturas(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

   const fetchProfesores = () => {
       API.getProfesores()
         .then((data) => setProfesores(data))
         .catch((err) => console.error(err));
     };
    


    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    const handleAgregar = () => {
        setCurrentAsignatura({
            id: null,
            nombre: "",
            creditos: "",
            profesor: "",
        });
        setModalOpen(true);
    };

    const handleEditar = (asignatura) => {
        setCurrentAsignatura({
            id: asignatura.id,
            nombre: asignatura.nombre,
            creditos: asignatura.creditos,
            profesor: asignatura.profesor,
        });
        setModalOpen(true);
    }

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                API.eliminarAsignatura(id)
                    .then(() => {
                        Swal.fire('Eliminado!', 'La asignatura ha sido eliminada.', 'success');
                        fetchAsignaturas();
                    })
                    .catch((err) => {
                        Swal.fire('Error', err.message, 'error');
                    });
            }
        });
    }

    const handleModalSubmit = (e) => {
        e.preventDefault();
        const { id, nombre, creditos, profesor } = currentAsignatura;

        if (!nombre || !creditos || !profesor) {
            Swal.fire(
                "Error",
                "Nombre, Créditos y Profesor son obligatorios",
                "warning"
            );
            return;
        }
         if (id) {
              API.actualizarAsignatura(currentAsignatura)
                .then(() => {
                  setModalOpen(false);
                  fetchAsignaturas();
                  Toast.fire({
                    icon: "success",
                    title: "asignatura actualizado correctamente",
                  });
                })
                .catch((err) => Swal.fire("Error", err.message, "error"));
            } else {
              API.insertarAsignatura(currentAsignatura)
                .then(() => {
                  setModalOpen(false);
                  fetchAsignaturas();
                  Toast.fire({
                    icon: "success",
                    title: "Asignatura insertada",
                  });
                })
                .catch((err) => Swal.fire("Error", err.message, "error"));
            }
          };

    useEffect(() => {
        fetchAsignaturas();
        fetchProfesores();
    }, []);

    // Paginación
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentAsignaturas = asignaturas.slice(indexOfFirst, indexOfLast);
    const currentProfesores = profesores.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(asignaturas.length / itemsPerPage);

    //Exportar
    const handleExport = (type) => {
        const dataToExport = asignaturas.map((p) =>
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
            XLSX.utils.book_append_sheet(wb, ws, "Asignaturas");
            XLSX.writeFile(wb, "Asignaturas.xlsx");
        } else {
            const doc = new JSPDF();
            doc.setFontSize(16);
            doc.text("Listado de Asignaturas", 14, 20);
            const head = columnasDisponibles
                .filter((c) => selectedColumns.includes(c.key))
                .map((c) => c.label);
            const body = dataToExport.map((a) =>
                selectedColumns.map((key) => String(a[key] ?? ""))
            );
            autoTable(doc, {
                head: [head],
                body,
                startY: 30,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185] },
            });
            doc.save("Asignaturas.pdf");
        }

        setIsColumnsModalOpen(false);
    };

    const toggleColumn = (key) => {
        setSelectedColumns(prev =>
            prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
        );
    };


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Asignaturas</h4>
                <div>
                    <button className="btn btn-success me-2" onClick={handleAgregar}>Agregar Asignatura</button>
                    <button className="btn btn-secondary" onClick={() => setIsColumnsModalOpen(true)}>Exportar</button>
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
                            {currentAsignaturas.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.creditos}</td>
                                    <td>{p.profesor}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditar(p)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(p.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}
            {
                modalOpen && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={handleModalSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{currentAsignatura?.id ? "Editar Asignatura" : "Agregar Asignatura"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={currentAsignatura.nombre}
                                            onChange={(e) =>
                                                setCurrentAsignatura({ ...currentAsignatura, nombre: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Creditos</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={currentAsignatura.creditos}
                                            onChange={(e) =>
                                                setCurrentAsignatura({ ...currentAsignatura, creditos: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Profesor</label>

                                        <select
                                            className="form-control"
                                            value={currentAsignatura.profesor}
                                            onChange={(e) =>
                                                setCurrentAsignatura({
                                                    ...currentAsignatura,
                                                    profesor: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Seleccione un profesor</option>
                                              {currentProfesores.map((p) => (

                                            <option key={p.usuario} value={p.usuario}>{p.usuario}</option>
                                        
                                              ))}
                                        </select>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                )
            }
            {isColumnsModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Seleccionar columnas para exportar</h5>
                                <button type="button" className="btn-close" onClick={() => setIsColumnsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                {columnasDisponibles.map((col) => (
                                    <div className="form-check" key={col.key}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedColumns.includes(col.key)}
                                            onChange={() => toggleColumn(col.key)}
                                            id={`col-${col.key}`}
                                        />
                                        <label className="form-check-label" htmlFor={`col-${col.key}`}>
                                            {col.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => handleExport('excel')}>Exportar a Excel</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleExport('pdf')}>Exportar a Pdf</button>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}


