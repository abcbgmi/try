module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        // unique: true 
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      GST: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      Product_tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      product_discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      product_discount_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      product_video: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      shipping_charge: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      product_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_modify_object:{
        type: DataTypes.JSON,
        allowNull: false,
      },
      product_view: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      product_quantity :{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      admin_topview: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      admin_bestselling: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
  return Product;
};
