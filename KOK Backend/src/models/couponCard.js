module.exports = (sequelize, DataTypes) => {
  const couponCard = sequelize.define(
    "couponCard",
    {
      couponCard_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      couponCard_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      discount_code: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      discount_Amt: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      discount_per: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      couponCard_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
    }
  );
  return couponCard;
};
