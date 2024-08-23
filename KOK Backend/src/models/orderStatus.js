module.exports = (sequelize, DataTypes) => {
  const orderStatus = sequelize.define(
    "orderStatus",
    {
      status_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      status_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        // unique: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeValidate: (instance, options) => {
          if (instance.status_name) {
            instance.status_name = instance.status_name.charAt(0).toUpperCase() + instance.status_name.slice(1).toLowerCase();
          }
        },
      },
    }
  );
  return orderStatus;
};
