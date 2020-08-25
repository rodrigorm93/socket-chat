//tendremos las funciones para renderizar el html

//renderizaremos usuarios
var params = new URLSearchParams(window.location.search);
var nombre = params.get("nombre"); //sacamso l nombre del url
var sala = params.get("sala"); //sacamos el numero de la sala

//referencias de jQuery
var divUsuario = $("#divUsuarios");
var formEnviar = $("#formEnviar");
var txtMensaje = $("#txtMensaje");

var tituloSala = $("#titulo");

var divChatbox = $("#divChatbox");

function renderizarTitulo() {
  var html = "";
  html += '<h3 class="box-title">';
  html += "Sala de chat: <small>" + params.get("sala") + "</small>";
  html += "</h3>";

  tituloSala.html(html);
}

function renderizarUsuarios(personas) {
  console.log("ff", personas);

  var html = "";

  html += "<li>";
  html +=
    '<a href="javascript:void(0)" class="active">Chat de <span> ' +
    params.get("sala") +
    "</span>";
  html += "</a>";
  html += " </li>";

  //para mostrar la lista de usuarios

  for (var i = 0; i < personas.length; i++) {
    html += "<li>";
    html +=
      '<a data-id="' +
      personas[i].id +
      '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"/>';
    html +=
      "<span >" +
      personas[i].nombre +
      '<small class="text-success">online</small></span></a>';
    html += "</li>";
  }

  divUsuario.html(html);
}

// yo es el parametro para vverigficar quin lo envio
function renderizarMensajes(mensaje, yo) {
  var html = "";

  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours() + ":" + fecha.getMinutes();

  var adminClass = "info";

  if (mensaje.nombre === "Admin") {
    adminClass = "danger";
  }

  //si son lo demas meuestro esto:
  if (yo) {
    //cuando soy yo muestro lo de abajo

    var html = "";
    html += '<li class="reverse">';
    html += '<div class="chat-content">';
    html += "<h5>" + mensaje.nombre + "</h5>";
    html += '<div class="box bg-light-inverse">' + mensaje.mensaje + "</div>";
    html += "</div>";
    html += '<div class="chat-img">';
    html += '<img src="assets/images/users/5.jpg" alt="user" />';
    html += "</div>";
    html += '<div class="chat-time">' + hora + "</div>";
    html += "</li>";
  } else {
    html += '<li class="animated fadeIn">';
    html += '<div class="chat-img">';
    if (mensaje.nombre !== "Admin") {
      html += '<img src="assets/images/users/1.jpg" alt="user" />';
    }

    html += "</div>";
    html += '<div class="chat-content">';
    html += "<h5>" + mensaje.nombre + "</h5>";
    html +=
      '<div class="box bg-light-' +
      adminClass +
      '">' +
      mensaje.mensaje +
      "</div>";
    html += "</div>";
    html += '<div class="chat-time">' + hora + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

//mueve automaticamente el scroll
function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

// Escuchas, cuando se haga un clik a un usuario obtendremos su id
// cyando se haga clik a un etiqueta <a> dentro de divUsuario se desplega un funcion
divUsuario.on("click", "a", function () {
  var id = $(this).data("id"); // hacemos referencia  a lo que hacemos click, data-id

  if (id) {
    // existe el id imprimimos el id
    console.log(id);
  }
});

//echuca de los mensajes

formEnviar.on("submit", function (e) {
  e.preventDefault();

  if (txtMensaje.val().trim().length === 0) {
    return;
  }
  // console.log(txtMensaje.val());

  // Enviar información
  socket.emit(
    "crearMensaje",
    {
      nombre: nombre,
      mensaje: txtMensaje.val(),
    },
    function (mensaje) {
      txtMensaje.val("").focus();
      //yo=true porque cuando lo envio si soy yo
      renderizarMensajes(mensaje, true); //pára envfiar el mensaje
      scrollBottom();
    }
  );
});
