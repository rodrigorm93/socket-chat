const { io } = require("../server");

const { Usuarios } = require("../classes/usuario");

const { crearMensaje } = require("../utils/utils");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  //recivimos el  usuario conectado
  client.on("entrarChat", (data, callback) => {
    //sino no vien el nombre

    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "el nombre/sala es necesario",
      });
    }

    //conectar un usuario  a una sala
    client.join(data.sala);

    usuarios.agregarPersona(client.id, data.nombre, data.sala);

    //mandaremos un evento para que todas las personas escuchen,
    //cada vez que una perosna entre o salga del chat
    client.broadcast
      .to(data.sala)
      .emit("listarPersona", usuarios.getPersonasPorSala(data.sala));

    client.broadcast
      .to(data.sala)
      .emit("crearMensaje", crearMensaje("Admin", `${data.nombre} se unio`));

    callback(usuarios.getPersonasPorSala(data.sala)); //con eso retornaremso todoas las perosnas que se encuentren en la sala
  });

  //necsitamos especificar al servidor cuando le esten mandando un emnsaje el cliente

  client.on("crearMensaje", (data, callback) => {
    let persona = usuarios.getPersona(client.id); //obtnemos la informaciond e la persona que envia el mensaje
    let mensaje = crearMensaje(persona.nombre, data.mensaje); //obtenemos el mensaje

    client.broadcast.to(persona.sala).emit("crearMensaje", mensaje); // enviamos el emsaje a todos los clientes

    callback(mensaje); // cuando ya notifique a todos regresare el mensaje
  });
  //evento de la desconexion

  client.on("disconnect", () => {
    //regresa la persona borrada

    let personaBorrada = usuarios.borrarPersona(client.id);

    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        "crearMensaje",
        crearMensaje("Admin", `${personaBorrada.nombre} se desconecto`)
      );

    client.broadcast
      .to(personaBorrada.sala)
      .emit("listarPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
  });

  //Mensajes privados: escuchamos
  //recibimos la data el cual debe contener el id de la persona

  client.on("mensajePrivado", (data) => {
    let persona = usuarios.getPersona(client.id); // sabemos que persona manda el msj

    //en la data viene le msj
    //.to(data.para): para enviar el mesaje a una persona especifica
    client.broadcast
      .to(data.para)
      .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
  });
});
