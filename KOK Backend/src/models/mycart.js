
module.exports = (sequelize, DataTypes) => {

    const mycart = sequelize.define('mycart', {
        mycart_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        product_modify_object:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        in_cart : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        },
        // order_ids: {
        //     type: DataTypes.TEXT,
        //     allowNull: false
        // },
        // order_sub_total: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_total_gst: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_total_tax: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_shipping: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_discount: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_total_Amt: {
        //     type: DataTypes.FLOAT,
        //     allowNull: false
        // },
        // order_status: {
        //     type: DataTypes.TEXT,
        //     allowNull: false
        // },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
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
    return mycart
}
