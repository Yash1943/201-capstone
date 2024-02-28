"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("sportsessions", "sport_name", {
      type: Sequelize.DataTypes.STRING, // Adjust the data type if necessary
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("sportsessions", "sport_name");
  },
};
