"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("MonsantoMeasures", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        domain: {
          allowNull: false,
          type: Sequelize.STRING
        },
        code: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .catch(err => console.log(err));
  },
  down: queryInterface => {
    return queryInterface
      .dropTable("MonsantoMeasures")
      .catch(err => console.log(err));
  }
};
