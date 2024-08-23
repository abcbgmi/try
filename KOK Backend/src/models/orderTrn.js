
module.exports = (sequelize, DataTypes) => {

    const OrderTrn = sequelize.define('OrderTrn', {
        orderTrn_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        mycart_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        product_modify_object:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        product_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_price:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Product_GST:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },  
        Product_tax:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        order_coupon_code:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_deleted:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        created_date:{
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_date:{
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    })
    return OrderTrn
}
