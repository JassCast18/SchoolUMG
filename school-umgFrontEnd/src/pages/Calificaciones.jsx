import React, { useEffect, useState } from 'react';
import * as API from '../services/data';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as JSPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Calificaciones = () => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modoEditar, setModoEditar] = useState(false);
    const [calificacionActual, setCalificacionActual] = useState({
        id: 0,
        descripcion: "",
        nota: 0,
        matriculaId: 0,
        alumnoDni: "",
        alumnoNombre: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const profesorUsuario = localStorage.getItem('usuario');

    const columnasDisponibles = [
        { key: 'id', label: 'ID' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'nota', label: 'Nota' },
        { key: 'matriculaId', label: 'Matrícula ID' },
        { key: 'alumnoDni', label: 'DNI Alumno' },
        { key: 'alumnoNombre', label: 'Nombre Alumno' }
    ];
    const [selectedColumns, setSelectedColumns] = useState(columnasDisponibles.map(col => col.key));
    const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);

    const cargar = () => {
        setLoading(true);
        API.getCalificacionesProfesor(profesorUsuario)
            .then(data => {
                setCalificaciones(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || String(err));
                setLoading(false);
            });
    };

    useEffect(() => {
        if (profesorUsuario) {
            cargar();
        }
    }, [profesorUsuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCalificacionActual(prev => ({ ...prev, [name]: value }));
    };

    const abrirAgregar = () => {
        setModoEditar(false);
        setCalificacionActual({
            id: 0,
            descripcion: "",
            nota: 0,
            matriculaId: 0,
            alumnoDni: "",
            alumnoNombre: ""
        });
        setShowModal(true);
    };

    const abrirEditar = (calificacion) => {
        setModoEditar(true);
        setCalificacionActual({
            ...calificacion,
            nota: Number(calificacion.nota),
            matriculaId: Number(calificacion.matriculaId)
        });
        setShowModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!calificacionActual.descripcion || !calificacionActual.matriculaId) {
            Swal.fire('Error!', 'Descripcion y Matricula ID son obligatorios', 'warning');
            return;
        }

        if (modoEditar) {
            API.actualizarCalificacion(calificacionActual)
                .then(() => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'La calificación ha sido actualizada.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    setShowModal(false);
                    cargar();
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire('Error!', err.message || "error al actualizar", 'error');
                });
        } else {
            API.insertarCalificacion(calificacionActual)
                .then(() => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'La calificación ha sido creada.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    setShowModal(false);
                    cargar();
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire('Error!', err.message || "error al insertar", 'error');
                });
        }

    };

    const handleeliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                API.eliminarCalificacion(id)
                    .then(() => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'La calificación ha sido eliminada.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setCalificaciones(prev => prev.filter(c => c.id !== id));
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire('Error!', err.message || "error al eliminar", 'error');
                    });
            }
        });
    };

    //Logica de Exportacion
    const handleExport = (type) => {
        const dataToExport = calificaciones.map((c) =>
            selectedColumns.reduce((obj, key) => {
                obj[key] = c[key] ?? "";
                return obj;
            }, {})
        );
        if (dataToExport.length === 0) {
            Swal.fire('Atencion', 'No hay calificaciones para exportar', 'info');
            return;
        }

        if (type === 'excel') {
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
            XLSX.writeFile(wb, "calificaciones.xlsx");
        } else {
            const doc = new JSPDF.jsPDF();
            doc.setFontSize(16);
            doc.text("Listado de Calificaciones", 14, 20);
            const head = columnasDisponibles
                .filter(col => selectedColumns.includes(col.key))
                .map(col => col.label);
            const body = dataToExport.map(c => selectedColumns.map(key => String(c[key] ?? "")));
            autoTable(doc, {
                head: [head],
                body,
                startY: 30,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185] }


            });
            doc.save("Calificaciones.pdf");
        }
        setIsColumnsModalOpen(false);
    }

    //Paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCalificaciones = calificaciones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(calificaciones.length / itemsPerPage);

    if (Loading) return <p>Cargando calificaciones...</p>;
    if (error) return <p className='text-danger'>Error: {error}</p>;

    return (
        <div className='container mt-3'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h3>Calificaciones</h3>
                <div className='d-flex gap-2'>
                    <button className='btn btn-success' onClick={abrirAgregar}>
                        Agregar calificacion
                    </button>
                    <button
                        className='btn btn-secondary'
                        onClick={() => setIsColumnsModalOpen(true)}
                    >
                        Exportar
                    </button>

                </div>

            </div>
            {calificaciones.length > 0 ? (
                <>
                    <table className='table table-striped table-bordered'>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>Descripcion</th>
                                <th>Nota</th>
                                <th>Matricula ID</th>
                                <th>DNI Alumno</th>
                                <th>Nombre Alumno</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCalificaciones.map((calificacion) => (
                                <tr key={calificacion.id}>
                                    <td>{calificacion.id}</td>
                                    <td>{calificacion.descripcion}</td>
                                    <td>{calificacion.nota}</td>
                                    <td>{calificacion.matriculaId}</td>
                                    <td>{calificacion.alumnoDni}</td>
                                    <td>{calificacion.alumnoNombre}</td>
                                    <td>
                                        <button className='btn btn-primary btn-sm me-2' onClick={() => abrirEditar(calificacion)}>
                                            Editar
                                        </button>
                                        <button className='btn btn-danger btn-sm' onClick={() => handleeliminar(calificacion.id)}>
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
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            ) : (
                <p>No hay calificaciones disponibles</p>
            )}
            {showModal && (
                <div className='modal show d-block' tabIndex='-1'>
                    <div className='modal-dialog'>
                        <form className='modal-content' onSubmit={handleSubmit}>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{modoEditar ? 'Editar Calificación' : 'Nueva Calificación'}</h5>
                                <button type='button' className='btn-close' onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className='modal-body'>
                                <div className='mb-3'>
                                    <label className='form-label'>Descripción</label>
                                    <input
                                        name='descripcion'
                                        className='form-control'
                                        value={calificacionActual.descripcion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label'>Nota</label>
                                    <input
                                        name='nota'
                                        type='number'
                                        step="0.1"
                                        className='form-control'
                                        value={calificacionActual.nota}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label'>Matrícula ID</label>
                                    <input
                                        name='matriculaId'
                                        type='text'
                                        className='form-control'
                                        value={calificacionActual.matriculaId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {modoEditar && (
                                    <>
                                        <div className='mb-3'>
                                            <label className='form-label'>DNI Alumno</label>
                                            <input
                                                name='alumnoDni'
                                                className='form-control'
                                                value={calificacionActual.alumnoDni}
                                                readOnly
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label'>Nombre Alumno</label>
                                            <input
                                                name='alumnoNombre'
                                                className='form-control'
                                                value={calificacionActual.alumnoNombre}
                                                readOnly
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                                <button type='submit' className='btn btn-primary'>
                                    {modoEditar ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isColumnsModalOpen && (
                <div className='modal show d-block' tabIndex='-1'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Seleccionar Columnas para Exportar</h5>
                                <button type='button' className='btn-close' onClick={() => setIsColumnsModalOpen(false)}></button>
                            </div>
                            <div className='modal-body'>
                                {columnasDisponibles.map(col => (
                                    <div className='form-check' key={col.key}>
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            id={col.key}
                                            checked={selectedColumns.includes(col.key)}
                                            onChange={() => {
                                                setSelectedColumns(prev =>
                                                    prev.includes(col.key)
                                                        ? prev.filter(c => c !== col.key)
                                                        : [...prev, col.key]
                                                );
                                            }}
                                        />
                                        <label className='form-check-label' htmlFor={col.key}>
                                            {col.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-success' onClick={() => handleExport("excel")} >
                                    Exportar a Excel
                                </button>
                                <button className='btn btn-danger' onClick={() => handleExport("pdf")} >
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
