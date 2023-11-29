const db = require('../config/config');


const Recordatorio ={};

Recordatorio.create = async (recordatorio, result)=>{


    const sql = `
    INSERT INTO recordatorios
    (fechaCreacion, 
        userId, 
        notaTexto, 
        notaVoz, 
        notaFoto, 
        latitud, 
        longitud)
        
        VALUES(?,?,?,?,?,?,?)`;


    db.query(sql, [
        new Date(),
        recordatorio.userId,
        recordatorio.notaTexto,
        recordatorio.notaVoz,
        recordatorio.notaFoto,
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


module.exports = Recordatorio;