import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Socket = sequelize.define(
  "Socket",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    connectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "sockets",
    timestamps: false,
  }
);

User.hasMany(Socket, { foreignKey: "userId" });
Socket.belongsTo(User, { foreignKey: "userId" });

export default Socket;
