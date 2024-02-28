"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("sportsessions", "cancel_status", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    await queryInterface.addColumn("sportsessions", "cancelled_reason", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("sportsessions", "cancel_status");
    await queryInterface.removeColumn("sportsessions", "cancelled_reason");
  },
};
