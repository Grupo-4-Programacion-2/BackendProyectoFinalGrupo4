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
    
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), usersController.updateWithoutImage);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), usersController.updateNotificationToken);


    app.get('/api/users/findByCode/:code', passport.authenticate('jwt', { session: false }), usersController.findByCode);
    app.post('/api/users/sendcode', usersController.UpdateCode);
    app.post('/api/users/updatepassword', usersController.UpdatePassword);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), usersController.updateNotificationToken);
}   