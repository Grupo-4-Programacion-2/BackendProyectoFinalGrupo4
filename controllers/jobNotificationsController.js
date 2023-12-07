const cron = require('node-cron');
const db = require('../config/config');
const User = require('../models/user');
const { sendNotification } = require('./pushNotificationsController');
const { convertirFormato24a12 } = require('../utils/convertHora');



function update(id){
    const sql=`update recordatorios set estado='COMPLETADOS' where id=?`;
    db.query(sql,[id],
        (err, res) => {
        if (err) {
            console.log('Error:', err);   
        }
        else {
            console.log("Número de filas actualizadas: ", res.affectedRows);
        }
    })
}


let users=null;
let usersMas1=null;
async function MiFuncion (){
    const today = new Date();

    // Obtener el año, mes y día
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');  // Los meses van de 0 a 11, por eso se suma 1
    const day = today.getDate().toString().padStart(2, '0');

    // Formatear la fecha en 'yyyy-mm-dd'
    const formattedDate = `${year}-${month}-${day}`;

    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes()+5);

    const horas = ahora.getHours().toString().padStart(2, '0'); // Asegura que siempre tenga dos dígitos
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    
    const horaActual = `${horas}:${minutos}`;

    const horaFinal = convertirFormato24a12(horaActual);

    const ahoraMas1 = new Date();
    ahoraMas1.setMinutes(ahoraMas1.getMinutes()+1);
    const horasMas1 = ahoraMas1.getHours().toString().padStart(2, '0'); // Asegura que siempre tenga dos dígitos
    const minutosMas1 = ahoraMas1.getMinutes().toString().padStart(2, '0');
    
    const horaActualMas1 = `${horasMas1}:${minutosMas1}`;

    const horaFinalMas1 = convertirFormato24a12(horaActualMas1);
    
    console.log("Fecha: ",formattedDate,", Hora(+1 min): ",horaFinalMas1);
    console.log("Fecha: ",formattedDate,", Hora(+5 min): ",horaFinal);


    

    

    
    
    const sql = `
        SELECT
            CONVERT(r.id, char) AS id,
            u.notification_token
            
        FROM   
            recordatorios r inner join usuarios u on r.userId=u.id
        WHERE
            fechaCita = ? and horaCita=?`;

    db.query(
        sql,
        [formattedDate, horaFinal],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                
            }
            else {  
                console.log('Usuario obtenido:', user);
                users = user;
            }
        });
    
    const sql1 = `
        SELECT
            CONVERT(r.id, char) AS id,
            u.notification_token
            
        FROM   
            recordatorios r inner join usuarios u on r.userId=u.id
        WHERE
            fechaCita = ? and horaCita=?`;

    db.query(
        sql1,
        [formattedDate, horaFinalMas1],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                
            }
            else {  
                console.log('Usuario obtenido:', user);
                usersMas1 = user;
            }
        })

        
    

}


cron.schedule('* * * * *', async () => {
  //console.log('running a task every minute');
  await MiFuncion();

  if(users != null){
    users.forEach(element => {
        const userToken=element.notification_token;
        sendNotification(userToken,{title: "Recordatorio", body:"Tu cita comenzara en 5 minutos", id_notification:"1"})
        //console.log(userToken);
      });
    }

    if(usersMas1 != null){
        usersMas1.forEach(element => {
            const userToken=element.notification_token;
            sendNotification(userToken,{title: "Apresurate", body:"Tu cita comienza ya!", id_notification:"1"})
            //console.log(userToken);
            update(element.id);
          });
    }
  
});