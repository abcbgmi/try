
module.exports = (sequelize, DataTypes) => {

    const category = sequelize.define('category', {
        category_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        category_name: {
            type: DataTypes.TEXT,
            allowNull: false,
            // unique: true
          },
        category_image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category_banner_image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        hooks: {
          beforeValidate: (instance, options) => {
            if (instance.category_name) {
              instance.category_name = instance.category_name.charAt(0).toUpperCase() + instance.category_name.slice(1).toLowerCase();
            }
          },
        },
    })
    return category
}
