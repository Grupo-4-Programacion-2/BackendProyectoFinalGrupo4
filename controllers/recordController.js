const Recordatorio = require('../models/recordatorio');
const storage = require('../utils/2.2 cloud_storage');


module.exports = {
    
    
    async registerTasks(req, res) {

        const remembers = JSON.parse(req.body.remembers); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                remembers.image = url;
            }
        }

        Recordatorio.create(remembers, (err, data) => {
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
                data: remembers // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        });

    },

    async deleteTask(req, res) {
        const id = req.params.id; // O cualquier manera que estés enviando el ID
      
        Recordatorio.deleteTask(id, (err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Hubo un error al intentar eliminar el registro',
              error: err.message,
            });
          }
      
          return res.status(200).json({
            success: true,
            message: 'El registro se eliminó correctamente',
            data: id,
          });
        });
      },   
      
      getAllData(req, res){
        const userId = req.params.userId;

        Recordatorio.getAll(userId, (err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con listar las ordenes',
                    error: err
                });
            }
            return res.status(201).json(data)

        });
    },

    async updateWithImage(req, res) {

        const remembers = JSON.parse(req.body.remembers); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                remembers.image = url;
            }
        }

        Recordatorio.update(remembers, (err, data) => {
       
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: data
            });

        });

    },

    async updateWithoutImage(req, res) {

        const remembers = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        Recordatorio.updateWithoutImage(remembers, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: data
            });

        });

    },


}