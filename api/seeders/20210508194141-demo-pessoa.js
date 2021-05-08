'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Pessoas', [
       {
         nome: 'Ana Souza',
         ativo: true,
         email: 'ana@ana.com',
         role: 'estudante',
         createdAt: new Date(),
         updatedAt: new Date()
       }
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('People', null, {});
  }
};
