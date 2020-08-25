class Usuarios {
  constructor() {
    this.personas = []; //arreglo con los datos de las personas
  }

  agregarPersona(id, nombre, sala) {
    let persona = {
      id,
      nombre,
      sala,
    };

    this.personas.push(persona);

    return this.personas;
  }

  //funcion apra obtener una persona por ID

  getPersona(id) {
    let persona = this.personas.filter((persona) => persona.id === id)[0]; //regresa un arreglo y solo encesitamos el primer elemento

    //sino no encuentra ninguna persona retornaremo un undefine
    return persona;
  }

  getPersonas() {
    return this.personas; //regresamos todas las personas
  }

  getPersonasPorSala(sala) {
    let personaEnSala = this.personas.filter(
      (persona) => persona.sala === sala
    );

    return personaEnSala;
  }

  borrarPersona(id) {
    let personaBorrada = this.getPersona(id);
    this.personas = this.personas.filter(
      (persona) => persona.id != id //retonara una arreglo sin ese id y lo guadaremos en otro arreglo
    );

    return personaBorrada;
  }
}

module.exports = {
  Usuarios,
};
