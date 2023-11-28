const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/2.2 cloud_storage');

const nodeMailer = require('nodemailer');
var code11 = 0;

module.exports = {

    register(req, res) {

        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });

        });

    },
    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: user // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        });

    },

    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {

            console.log('Error ', err);

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    phone: myUser.phone,
                    email: myUser.email,
                    photo: myUser.photo,
                    session_token: `JWT ${token}`
                }

                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
                });

            }
            else {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El password es incorrecto'
                });
            }

        });

    },
    
    findByCode(req, res) {
        const code20 = req.params.code;

        User.findByCode(code20, async (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el codigo',
                    error: err
                });
            }
            
            if(data == undefined){
                return res.status(404).json({
                    success: false,
                    message: 'No se encontro el codigo',
                });
            }else {
                if(code20 == data.code){
                    return await res.status(201).json(data);
                } 
            }
            
        });
    },

    UpdateCode(req, res) {

        const email = req.body.email; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        sendMail3(email); 
        User.updateCode(email, code11, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });

        });

    },

    UpdatePassword(req, res) {

        const email = req.body.email; 
        const password = req.body.password;
        User.updatePassword(email, password, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La actualizacion se ha realizo correctamente',
                data: data 
            });

        });

    },

};

sendMail3 = async (email) => {

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'turciosjimenez@gmail.com',
            pass: 'jizy pnij vrgg hrlj'
        }
    }

    code11 = generateCodeAccess();
    
    console.log("Change: " + code11);

    console.log(email);

    const mensaje = {
        from: 'turciosjimenez@gmail.com',
        to: `${email}`,
        subject: 'Correo De Verificacion de Usuario',
        text: `Este es su codigo de acceso ${code11}`
    }

    const transport = nodeMailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    console.log(info);

}

function generateCodeAccess() {
    return Math.floor(10000 + Math.random() * 90000);
}