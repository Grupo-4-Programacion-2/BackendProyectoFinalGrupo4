const recordController = require('../controllers/recordController');
const passport = require('passport');

module.exports = (app, upload)=>{
    app.post('/api/records/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), recordController.registerTasks);
    app.get('/api/records/getAll', recordController.getAll);
}