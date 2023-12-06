const { parse, format } = require('date-fns');


  function convertirFormato12a24 (hora12h) {
    // Parsea la cadena de tiempo en formato de 12 horas
    const fecha = parse(hora12h, 'h:mm a', new Date());
  
    // Formatea la cadena de tiempo en formato de 24 horas
    const hora24h = format(fecha, 'HH:mm');
  
    return hora24h;
  }
  
  function convertirFormato24a12(hora24h) {
    // Parsea la cadena de tiempo en formato de 24 horas
    const fecha = parse(hora24h, 'HH:mm', new Date());
  
    // Formatea la cadena de tiempo en formato de 12 horas
    const hora12h = format(fecha, 'h:mm a');
  
    return hora12h;
  }

  module.exports = { 
    convertirFormato12a24,
    convertirFormato24a12
  }