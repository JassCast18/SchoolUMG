const URL = 'https://etmvxkxkzl.execute-api.us-east-1.amazonaws.com/dev/api/';

export function login(usuario, pass){
    let datos = {usuario, pass};

    return fetch(URL + 'autenticacion', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res =>{
        if(!res.ok) throw new Error('Error en la solicitud'+ res.status);
        return res.text();
    })
    .then(text => text ? text : null);
}

export function alumnoProfesor(usuario){
    return fetch(`${URL}getAlumnosProfesor?usuario=${usuario}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function getAlumno(id){
    return fetch(`${URL}getAlumno?id=${id}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function insertarAlumnoMatricular(alumno, id_asig){
    const url= `${URL}insertarMatricular?id_asig=${id_asig}`;
    const body ={
        dni: alumno.dni,
        nombre: alumno.nombre,
        direccion: alumno.direccion,
        edad: Number(alumno.edad),
        email: alumno.email
    };

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.text();
    });
}

export function actualizarAlumno(alumno){
    return fetch(`${URL}actualizarAlumno`, {
        method: 'PUT',
        body: JSON.stringify(alumno),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.text();
    });
}

export function eliminarAlumno(id){
    return fetch(`${URL}eliminarAlumno?id=${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.text();
    });
}

/* ASIGNATURAS */

export function getAsignaturas(){
    return fetch(`${URL}getAsignaturas`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function getAllAsignaturas(){
    return fetch(`https://etmvxkxkzl.execute-api.us-east-1.amazonaws.com/dev/api/getALLAsignaturas`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}
export function getAsignaturaId(id){
    return fetch(`${URL}getAsignaturaId?id=${id}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function insertarAsignatura(asignatura){
    const url= `${URL}insertarAsignatura`;
    const body ={
        nombre: asignatura.nombre,
        creditos: Number(asignatura.creditos),
        profesor: asignatura.profesor
    };
        
    
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });

}

export function actualizarAsignatura(asignatura){

    const url = `${URL}actualizarAsignatura?id=${asignatura.id}`;
    const body = {
        id: Number(asignatura.id),
        nombre: asignatura.nombre,
        creditos: Number(asignatura.creditos),
        profesor: asignatura.profesor

        
    };
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}
export function eliminarAsignatura(id){
    return fetch(`${URL}eliminarAsignatura?id=${id}`, {
        method: 'DELETE'
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}

/* CALificACIONES */

export function getCalificacionesProfesor(usuario){
    return fetch(`${URL}calificaciones/profesor/${usuario}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function insertarCalificacion(calificacion){
    const url = `${URL}insertCalificacion`;
    const body = {
        descripcion: calificacion.descripcion,
        nota: Number(calificacion.nota),
        porcentaje: Number(calificacion.porcentaje||0),
        matriculaId: Number(calificacion.matriculaId)
    };

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async res => {
        const text = await res.text();
        if(!res.ok) throw new Error(`Error ${res.status}: ${text}`);
        try{return JSON.parse(text);}catch{return text;}
    });    
}

export function actualizarCalificacion(calificacion){
    if(!calificacion.id)throw new Error("Falta el id de la calificacion para actualizar");

    const url = `${URL}actualizarCalificacion/${calificacion.id}`;
    const body = {
        descripcion: calificacion.descripcion,
        nota: Number(calificacion.nota),
        porcentaje: Number(calificacion.porcentaje||0),
        matriculaId: Number(calificacion.matriculaId)
    };

    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async res => {
        const text = await res.text();
        if(!res.ok) throw new Error(`Error ${res.status}: ${text}`);
        try{return JSON.parse(text);}catch{return text;}
    });
}

export function eliminarCalificacion(id){
    const url = `${URL}eliminarCalificacion/${id}`;

    return fetch(url, {
        method: 'DELETE'
    })
    .then(async res => {
        const text = await res.text();
        if(!res.ok) throw new Error(`Error ${res.status}: ${text}`);
        return text;
    });
}

/* PROFESORES */
export function getProfesores(){
    return fetch(`${URL}profesores`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}
export function getProfesor(usuario){
    return fetch(`${URL}profesor/${usuario}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function insertarProfesor(profesor){
    const url= `${URL}profesor`;
    const body ={
        usuario: profesor.usuario,
        pass: profesor.pass,
        nombre: profesor.nombre,
        email: profesor.email
        
    };
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}
export function actualizarProfesor(usuario, profesor){
    
    const url = `${URL}profesor/${usuario}`;
    const body = {
        usuario: usuario,
        pass: profesor.pass,
        nombre: profesor.nombre,
        email: profesor.email
        
    };
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}
export function eliminarProfesor(usuario){
    return fetch(`${URL}profesor/${usuario}`, {
        method: 'DELETE'
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}

//---------------------------------------------------------
// GRAFICAS
//---------------------------------------------------------

// Obtener alumnos por asignatura
export function getAlumnosPorAsignatura() {
    return fetch(`${URL}getAlumnosPorAsignatura`)
        .then(res => {
            if (!res.ok) throw new Error('Error en la solicitud: ' + res.status);
            return res.json();
        });
}

// Obtener distribucion de calificaciones
export function getDistribucionCalificaciones() {
    return fetch(`${URL}getDistribucionCalificaciones`)
        .then(res => {
            if (!res.ok) throw new Error("Error en la solicitud: " + res.status);
            return res.json();
        });
}

/* 
PRODUCTOS */

export function getProductos(){
    return fetch(`${URL}getProductos`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}
export function getProductosID(producto){
    return fetch(`${URL}getProductosId/${producto.id}`)
    .then(res => {
        if(!res.ok) throw new Error('Error en la solicitud' + res.status);
        return res.json();
    });
}

export function insertarProducto(producto){
    const url= `${URL}insertarProducto`;
    const body ={
        descripcion: producto.descripcion,
        stock: producto.stock,
        precio_venta: producto.precio_venta,
        id_categoria: producto.id_categoria,
        fecha_ingreso: producto.fecha_ingreso,
        fecha_caducidad: producto.fecha_caducidad
        
    };
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}
export function actualizarProducto(producto){
    const url = `${URL}producto/${producto.id_producto}`; // <- aquí usas id_producto
    const body = {
        id_producto: producto.id_producto,   // <- corregir nombre
        descripcion: producto.descripcion,
        stock: producto.stock,
        precio_venta: producto.precio_venta,
        id_categoria: producto.id_categoria,
        fecha_ingreso: producto.fecha_ingreso,
        fecha_caducidad: producto.fecha_caducidad
    };
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud ' + res.status + text);
        return text;
    });
}

export function eliminarProducto(producto){
    return fetch(`${URL}eliminarProducto/${producto.id}`, {
        method: 'DELETE'
    })
    .then( async res => {
        const text = await res.text();
        if(!res.ok) throw new Error('Error en la solicitud' + res.status + text);
        return text;
    });
}
