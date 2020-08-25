var socket = io();

//vamos a capturar el nombre del usuario que entre a chatear

var params = new URLSearchParams(window.location.search);

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("el nombre  y sala son necesarios");
}

//cuando me conecto mando el usuario y la sala
var usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");

  //apenas nos conectamos mandaremos un msj de quien soy yo
  socket.emit("entrarChat", usuario, function (resp) {
    console.log("Usuarios conectados", resp);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar mensaje

// Recivimos el mensaje del servidor, el cliente escucha
socket.on("crearMensaje", function (mensaje) {
  console.log("Servidor:", mensaje);
});

//escuchar cambios  de usuario cuando un usuario entra o salga del caht

socket.on("listarPersona", function (personas) {
  console.log(personas);
});

//mensaje privados: escuchamos un mensaje porvado en la parte del cliente
socket.on("mensajePrivado", function (mensaje) {
  console.log("Mensaje Privado", mensaje);
});
