const db = require('../config/config');


const Recordatorio = {};

Recordatorio.create = async (recordatorio, result) => {
    const sql = `
    INSERT INTO recordatorios
    (
        fechaCita,
        horaCita, 
        userId, 
        notaTexto, 
        notaVoz, 
        notaFoto, 
        latitud, 
        longitud,
        status
        )
        
        VALUES(?,?,?,?,?,?,?,?,?)`;


    db.query(sql, [
        recordatorio.fechaCita,
        recordatorio.horaCita,
        recordatorio.userId,
        recordatorio.notaTexto,
        recordatorio.notaVoz,
        recordatorio.image,
        recordatorio.latitud,
        recordatorio.longitud,
        'PENDIENTES'
    ], (err, res) => {
        if (err) {
            console.log("Error: ", err.message);
            result(err, null);
        } else {
            console.log("Id del nuevo registro: ", res.insertId);
            result(null, res.insertId);
        }
    })
}

// Recordatorio.getAll = async (userId, result) => {
//     const sql = `
//     SELECT CONVERT(id, char) AS id,
//        fechaCita,
//        horaCita,
//        CONVERT(userId, char) AS userId,
//        notaTexto,
//        notaVoz,
//        notaFoto,
//        latitud,
//        longitud
//     FROM recordatorios
//     WHERE userId = ?
//     ORDER BY fechaCita DESC
//     `;

//     db.query(sql,
//         [userId],
//         (err, recordatorio) => {
//         if (err) {
//             console.log('Error: ', err);
//             result(err, null);
//         } else {
//             console.log('Recordatorios: ', recordatorio);
//             result(null, recordatorio);
//         }
//     });
// }

Recordatorio.getAll = async (userId, status, result) => {
    const sql = `
    SELECT CONVERT(id, char) AS id,
        fechaCita,
        horaCita,
        CONVERT(userId, char) AS userId,
        notaTexto,
        notaVoz,
        notaFoto,
        latitud,
        longitud
    FROM recordatorios
    WHERE userId = ? AND status = ?
    ORDER BY fechaCita DESC;
    `;

    db.query(sql,[userId, status],
        (err, data) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Recordatorios: ', data);
                result(null, data);
            }
        });
}

Recordatorio.update = async (remembers, result) => {
    const sql = `
        UPDATE recordatorios
        SET
            fechaCita = ?,
            horaCita = ?,
            userId = ?,
            notaTexto = ?,
            notaVoz = ?,
            notaFoto = ?,
            latitud = ?,
            longitud = ?
        WHERE id = ?`;

    db.query(sql, [
        remembers.fechaCita,
        remembers.horaCita,
        remembers.userId,
        remembers.notaTexto,
        remembers.notaVoz,
        remembers.image,
        remembers.latitud,
        remembers.longitud,
        remembers.id
    ], (err, res) => {
        if (err) {
            console.log("Error: ", err.message);
            result(err, null);
        } else {
            console.log("Número de filas actualizadas: ", res.affectedRows);
            result(null, res.affectedRows);
        }
    });
};

Recordatorio.findById = (id, result) => {

    const sql = `
    SELECT
        CONVERT(id, char) AS id,
        fechaCita,
        horaCita, 
        userId, 
        notaTexto, 
        notaVoz, 
        notaFoto, 
        latitud, 
        longitud
    FROM   
        recordatorios
    WHERE
        id = ?`;

    db.query(
        sql,
        [id],
        (err, remembered) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', remembered[0]);
                result(null, remembered[0]);
            }
        }
    )

}

Recordatorio.updateWithoutImage = (remembers, result) => {

    const sql = `
    UPDATE recordatorios
    SET
        fechaCita = ?,
        horaCita = ?,
        userId = ?,
        notaTexto = ?,
        notaVoz = ?,
        latitud = ?,
        longitud = ?
    WHERE id = ?
  `;

    db.query
        (
            sql,
            [
                remembers.fechaCita,
                remembers.horaCita,
                remembers.userId,
                remembers.notaTexto,
                remembers.notaVoz,
                remembers.latitud,
                remembers.longitud,
                remembers.id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', remembers.id);
                    result(null, remembers.id);
                }
            }
        )
}


Recordatorio.updateStatus = (id, result) => {

    const sql = `
    UPDATE
        recordatorios
    SET
        status = ?
    WHERE
        id = ?
    `;

    db.query
        (
            sql,
            [
                'COMPLETADOS',
                id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', id);
                    result(null, newStatus);
                }
            }
        )
}


Recordatorio.deleteTask = (id, result) => {
    const sql = 'DELETE FROM recordatorios WHERE id = ?';

    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log("Error: ", err.message);
            result(err, null);
        } else {
            console.log(`Registro eliminado con ID: ${id}`);
            result(null, res);
        }
    });
};


module.exports = Recordatorio;