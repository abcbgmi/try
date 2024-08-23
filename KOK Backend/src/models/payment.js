module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define(
    "payment",
    {
      payment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      order_ids: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      order_pincode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [4, 6],
          isNumeric: true,
        },
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      payment_account: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      payment_in: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      payment_out: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      payment_total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    }
  );
  return payment;
};
