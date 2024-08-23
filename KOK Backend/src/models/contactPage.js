
module.exports = (sequelize, DataTypes) => {

    const contactPage = sequelize.define('contactPage', {
        contact_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_first_name: {
            type: DataTypes.TEXT, 
            allowNull: false
        },
        user_last_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        user_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        msg:{
            type: DataTypes.TEXT,
            allowNull: false 
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
    return contactPage
}
