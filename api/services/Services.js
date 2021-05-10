const database = require('../models');

class Services {
    constructor (nomeDoModelo) {
        this.nomeDoModelo = nomeDoModelo;
    }

    async pegaTodosOsRegistros() {
        return database[this.nomeDoModelo].findAll();
    }

    async pegaUmRegistro(id) {

    }

    async criaRegistro(dados) {

    }

    async atualizaRegistro(dados, id, transacao = {}) {
        return database[this.nomeDoModelo].update(dados, { where: { id }}, transacao);
    }

    async atualizaRegistro(dados, where, transacao = {}) {
        return database[this.nomeDoModelo].update(dados, { where: { ...where }}, transacao);
    }

    async apagaRegistro(id) {
        
    }
}

module.exports = Services;