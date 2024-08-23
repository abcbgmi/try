
module.exports = (sequelize, DataTypes) => {

    const images = sequelize.define('images', {
        image_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id:{
            type: DataTypes.BIGINT,
            allowNull: true 
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image_type:{
            type: DataTypes.INTEGER,
            allowNull: false 
        },
        image_tital:{
            type: DataTypes.TEXT,
            allowNull: true 
        },
        image_description:{
            type: DataTypes.TEXT,
            allowNull: true 
        },
        image_sub_description:{
            type: DataTypes.TEXT,
            allowNull: true 
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
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
    return images
}
