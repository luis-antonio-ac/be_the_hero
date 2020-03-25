const exprees = require('express');
const routes = exprees.Router();

const ongController = require('./controller/ongController');
const incidentController = require('./controller/incidentController');
const profileController = require('./controller/profileController');
const sessionController = require('./controller/sessionController');

// Fazendo login no sistema
routes.post('/sessions', sessionController.create);

// Listagem de todas as Ongs cadastradas no banco
routes.get('/ongs', ongController.index);
// Cadastro de Ongs no Banco
routes.post('/ongs', ongController.create);

// Listagem de todos os casos de uma ONG especifica
routes.get('/profile', profileController.index);

// Listagem de todos os incidentes cadastrados
routes.get('/incidents', incidentController.index);
// Cadastro de um novo caso no banco
routes.post('/incidents', incidentController.create);
// Deletar um caso
routes.delete('/incidents/:id', incidentController.delete);

module.exports = routes;