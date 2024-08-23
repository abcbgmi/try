
module.exports = (sequelize, DataTypes) => {

    const user_adress = sequelize.define('user_adress', {
        user_adress_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_first_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_last_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        user_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_pincode: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
              len: [4, 6],
              isNumeric: true 
            }
        },
        user_country: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_state: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // is_admin: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: 0
        // },
        // auth_token: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },
        // verify_email_code: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // is_logged_out: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false
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
        timestamps: false
    })
    return user_adress
}
