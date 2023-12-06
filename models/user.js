const db = require('../config/config');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
var code = 0;

const User = {};

User.create = async (user, result) => {

    const hash = await bcrypt.hash(user.password, 10);

    sendMail2(user.email);

    const sql = `
        INSERT INTO
            usuarios(   
                name,
                lastname,
                phone,
                email,
                password,
                photo,
                code
            )
        VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    db.query
        (
            sql,
            [
                user.name,
                user.lastname,
                user.phone,
                user.email,
                hash,
                user.image,
                code
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Id del nuevo usuario:', res.insertId);
                    result(null, res.insertId);
                }
            }
        )

}

User.findById = (id, result) => {

    const sql = `
    SELECT
        CONVERT(id, char) AS id,
        name,
        lastname,
        phone,
        email,
        password,
        photo
    FROM   
        usuarios
    WHERE
        id = ?`;

    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )

}

User.findByEmail = (email, result) => {

    const sql = `
    SELECT
        CONVERT(id, char) AS id,
        name,
        lastname,
        phone,
        email,
        password,
        photo
    FROM   
        usuarios
    WHERE
        email = ?
    `;

    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )

}


User.findByCode = (codesf, result) => {

    const sql = `
    SELECT 
        code 
    FROM 
        usuarios 
    WHERE code = ?
    `;

    db.query(
        sql,
        [codesf],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, user[0]);
            }
            else {
                console.log('Codigo obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )

}

User.updatePassword = async (email, password, result) => {

    const hash = await bcrypt.hash(password, 10);

    const sql = `
    UPDATE
        usuarios
    SET
        password = ?
    WHERE
        email = ?
    `;

    db.query
        (
            sql,
            [
                hash,
                email
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', email);
                    result(null, email);
                }
            }
        )
}

User.updateCode = (email, codes, result) => {

    const sql = `
    UPDATE
        usuarios
    SET
        code = ?
    WHERE
        email = ?
    `;

    db.query
        (
            sql,
            [
                codes,
                email
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', email);
                    result(null, email);
                }
            }
        )
}

User.update = (user, result) => {

    const sql = `
    UPDATE
        usuarios
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        photo = ?
    WHERE
        id = ?
    `;

    db.query
        (
            sql,
            [
                user.name,
                user.lastname,
                user.phone,
                user.image,
                user.id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', user.id);
                    result(null, user.id);
                }
            }
        )
}

User.updateWithoutImage = (user, result) => {

    const sql = `
    UPDATE
        usuarios
    SET
        name = ?,
        lastname = ?,
        phone = ?
    WHERE
        id = ?
    `;

    db.query
        (
            sql,
            [
                user.name,
                user.lastname,
                user.phone,
                user.id
            ],
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Usuario actualizado:', user.id);
                    result(null, user.id);
                }
            }
        )
}

User.updateNotificationToken = (id, token, result) => {

    const sql = `
    UPDATE
        usuarios
    SET
        notification_token = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            token,
            id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id);
            }
        }
    )
}


User.updateNotificationToken = (id, token, result) => {

    const sql = `
    UPDATE
        usuarios
    SET
        notification_token = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            token,
            id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id);
            }
        }
    )
}

module.exports = User;

sendMail2 = async (email) => {

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'turciosjimenez@gmail.com',
            pass: 'jizy pnij vrgg hrlj'
        }
    }

    code = generateCodeAccess();

    console.log(code);

    console.log(email);

    const mensaje = {
        from: 'turciosjimenez@gmail.com',
        to: `${email}`,
        subject: 'Correo De Verificacion de Usuario',
        text: `Este es su codigo ${code}`
    }

    const transport = nodeMailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    console.log(info);

}

function generateCodeAccess() {
    return Math.floor(10000 + Math.random() * 90000);
}