module.exports = (sequelize, DataTypes) => {
  const productImages = sequelize.define(
    "productImages",
    {
      productImage_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
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
  return productImages;
};
