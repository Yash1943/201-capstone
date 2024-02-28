"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sport extends Model {
    static associate(models) {
      // define association here
      sport.belongsTo(models.Users, {
        foreignKey: "userId",
      });
    }
    static async addsport({ id, sport_name, userId }) {
      return this.create({
        id: id,
        sport_name: sport_name,
        userId,
      });
    }
    static async getsport(userId) {
      return this.findAll({
        where: { userId },
      });
    }
    static async getsports() {
      return this.findAll();
    }

    deleteSport({ sport }) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }

    static async remove(sportId, userId) {
      try {
        return this.destroy({
          where: { id: sportId, userId },
        });
      } catch (error) {
        throw error;
      }
    }
  }

  sport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sport_name: DataTypes.STRING,
      sessioncount: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true, // Allow null values for createdAt
      },
    },
    {
      sequelize,
      modelName: "sport",
    }
  );

  return sport;
};
