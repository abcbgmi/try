
module.exports = (sequelize, DataTypes) => {

    const color = sequelize.define('color', {
        color_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        color_name: {
            type: DataTypes.TEXT,
            allowNull: false,
            // unique: true 
        },
        // color_description: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
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
              if (instance.color_name) {
                instance.color_name = instance.color_name.charAt(0).toUpperCase() + instance.color_name.slice(1).toLowerCase();
              }
            },
          },
    })
    return color
}
