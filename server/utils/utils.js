//recibe el nombre d ela persona y un mensaje
const crearMensaje = (nombre, mensaje) => {
  return {
    nombre,
    mensaje,
    fecha: new Date().getTime(),
  };
};

module.exports = {
  crearMensaje,
};
