const usersController = require('../controllers/userController');
const passport = require('passport');

module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/login', usersController.login);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    
    app.get('/api/users/findByCode/:code', passport.authenticate('jwt', { session: false }), usersController.findByCode);
    app.post('/api/users/sendcode', usersController.UpdateCode);
    app.post('/api/users/updatepassword', usersController.UpdatePassword);

}   