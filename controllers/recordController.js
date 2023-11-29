const Recordatorio = require('../models/recordatorio');


module.exports = {
    
    
    register(req, res){
        const record= req.body;


        Recordatorio.create(record, (err, data)=>{

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del recordatorio',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro  se creo correctamente',
                data: data
            });
        })
    }
}