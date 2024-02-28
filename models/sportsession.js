"use strict";
const { Model, Op, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sportsession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sportsession.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
    static async addsession({
      venue,
      numberofTeams,
      numberofplayers,
      playerNames,
      time,
      userId,
      sport_name,
    }) {
      return this.create({
        venue: venue,
        teamcount: numberofTeams,
        playercount: numberofplayers,
        playernames: playerNames,
        time: time,
        userId,
        sport_name: sport_name,
      });
    }
    static async getsession(sportName) {
      return this.findAll({
        where: {
          sport_name: sportName,
        },
      });
    }
    static async getjoinedsession(loggedInUser) {
      return this.findAll({
        where: {
          joined: {
            [Op.contains]: [loggedInUser],
          },
        },
      });
    }

    static async addplayer(sessionId, playerName, loggedInUser) {
      const session = await this.findByPk(sessionId);

      if (session) {
        const existingPlayerNames = session.playernames || "";
        const playerNameLower = playerName.toLowerCase();
        session.playernames = existingPlayerNames
          ? `${existingPlayerNames},${playerName}`
          : playerNameLower;
        session.joined = session.joined || [];
        session.joined = [...session.joined, loggedInUser];
        await session.save();
        return session;
      }

      throw new Error("Session not found");
    }
    static async cancelSession(sessionId, reason) {
      try {
        // Find the session by ID
        const session = await this.findOne({ where: { id: sessionId } });

        if (!session) {
          throw new Error("Session not found");
        }

        // Update the session as cancelled
        session.cancel_status = true;
        session.cancelled_reason = reason;

        // Save the changes to the database
        await session.save();

        // Log the cancellation reason
        console.log("Cancellation Reason:", reason);

        // Return the updated session object if needed
        return session;
      } catch (error) {
        throw new Error("Error cancelling session: " + error.message);
      }
    }
    static async getReports(fromDate, toDate) {
      try {
        const sessions = await this.findAll({
          attributes: [
            "sport_name",
            [Sequelize.fn("COUNT", Sequelize.col("id")), "session_count"],
          ],
          where: {
            time: {
              [Op.between]: [fromDate, toDate],
            },
          },
          group: ["sport_name"],
          raw: true,
          order: [[Sequelize.literal("session_count"), "DESC"]],
        });

        return sessions;
      } catch (error) {
        throw new Error("An error occurred while fetching the reports.");
      }
    }
  }
  sportsession.init(
    {
      venue: DataTypes.STRING,
      teamcount: DataTypes.INTEGER,
      playercount: DataTypes.INTEGER,
      playernames: DataTypes.STRING,
      time: DataTypes.DATE,
      sport_name: DataTypes.STRING,
      joined: DataTypes.ARRAY(DataTypes.INTEGER),
      cancel_status: DataTypes.BOOLEAN,
      cancelled_reason: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sportsession",
    }
  );
  return sportsession;
};
