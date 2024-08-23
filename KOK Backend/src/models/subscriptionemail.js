
module.exports = (sequelize, DataTypes) => {

    const subscriptionemail = sequelize.define('subscriptionemail', {
        email_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: true
            }
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
    })
    return subscriptionemail
}
