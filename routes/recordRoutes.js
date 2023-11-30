const recordController = require('../controllers/recordController');


module.exports = (app, upload)=>{


    app.post('/api/records/create', recordController.register);
    app.get('/api/records/getAll', recordController.getAll);
}