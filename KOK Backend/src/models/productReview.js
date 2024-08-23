module.exports = (sequelize, DataTypes) => {
  const productReview = sequelize.define(
    "productReview",
    {
      review_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      admin_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      review_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_testimonials: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
  return productReview;
};
