"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Users, { allowNull: false });
    }
  }
  Documents.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Documents",
      underscored: true,
    }
  );
  return Documents;
};
