const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const passport = require('passport');




const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//ROUTES
const usersRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./controllers/jobNotificationsController');

app.disable('x-powered-by');

app.set('port', port);

const upload = multer({
    storage: multer.memoryStorage()
});

usersRoutes(app, upload);
recordRoutes(app, upload);

server.listen(3000, '192.168.101.8' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});

app.get('/',  (req, res) => {
    res.send('Ruta raiz del backend');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

