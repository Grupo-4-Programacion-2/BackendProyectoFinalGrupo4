const Recordatorio = require('../models/recordatorio');
const storage = require('../utils/2.2 cloud_storage');


module.exports = {
    
    
    async registerTasks(req, res) {

        const remember = JSON.parse(req.body.remembers); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                remember.image = url;
            }
        }

        Recordatorio.create(remember, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            // remember.id = `${data}`;
            // const token = jwt.sign({id: remember.id, email: remember.email}, keys.secretOrKey, {});
            // user.session_token = `JWT ${token}`;

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        });

    },

    getAll(req, res){
        Recordatorio.getAll((err, data)=>{
            if(err){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al listar los recordatorios',
                    err:err
                })
            }

            return res.status(201).json(data);
        });
    }
}