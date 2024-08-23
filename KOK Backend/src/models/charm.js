
module.exports = (sequelize, DataTypes) => {

    const Charm = sequelize.define('Charm', {
        charm_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        charm_name: {
            type: DataTypes.TEXT,
            allowNull: false,
            // unique: true 
        },
        charm_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        charm_price: {
            type: DataTypes.FLOAT,
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
              if (instance.charm_name) {
                instance.charm_name = instance.charm_name.charAt(0).toUpperCase() + instance.charm_name.slice(1).toLowerCase();
              }
            },
          },
    })
    return Charm
}
