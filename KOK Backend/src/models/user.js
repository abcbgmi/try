
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
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
        user_email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        user_profile_photo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        user_password: {
            type: DataTypes.TEXT,
            allowNull: false
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
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        auth_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        verify_email_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_logged_out: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        timestamps: false
    })
    return User
}
