const db = require('../config/config');


const Recordatorio ={};

Recordatorio.create = async (recordatorio, result)=>{


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
        longitud)
        
        VALUES(?,?,?,?,?,?,?,?)`;


    db.query(sql, [
        recordatorio.fechaCita,
        recordatorio.horaCita,
        recordatorio.userId,
        recordatorio.notaTexto,
        recordatorio.notaVoz,
        recordatorio.image,
        recordatorio.latitud,
        recordatorio.longitud
    ], (err, res)=>{
        if(err){
            console.log("Error: ",err.message);
            result(err, null);
        }else{
            console.log("Id del nuevo registro: ", res.insertId);
            result(null, res.insertId);
        }
    })
}

Recordatorio.getAll = async (result)=>{
    const sql = `SELECT CONVERT(id, char) AS id, fechaCita, horaCita, CONVERT(userId, char) AS userId, notaTexto, notaVoz, notaFoto, latitud, longitud FROM recordatorios ORDER BY fechaCita desc`;

    db.query(sql, (err, data)=>{
        if(err){
            console.log('Error: ',err);
            result(err, null);
        }else{
            console.log('Recordatorios: ', data);
            result(null, data);
        }
    });
}


module.exports = Recordatorio;