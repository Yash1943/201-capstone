"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("sportsessions", "userId", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Assuming 'Users' is the name of your users table
        key: "id",
      },
    });
    await queryInterface.addConstraint("sportsessions", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("sportsessions", "userId");
    await queryInterface.removeConstraint(
      "sportsessions",
      "sportsessions_userId_fkey"
    );
  },
};
