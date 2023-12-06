const recordController = require('../controllers/recordController');
const passport = require('passport');

module.exports = (app, upload)=>{
    app.post('/api/records/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), recordController.registerTasks);
    app.get('/api/users/getAll/:userId/:status', recordController.getAllData);
    app.delete('/api/records/delete/:id', passport.authenticate('jwt', { session: false }), recordController.deleteTask);
    
    app.put('/api/records/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), recordController.updateWithImage);
    app.put('/api/records/updateWithoutImage', passport.authenticate('jwt', { session: false }), recordController.updateWithoutImage);

}