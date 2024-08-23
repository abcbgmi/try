
module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        // product_id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: false
        // },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        order_status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order_total: {
            type: DataTypes.FLOAT,
            allowNull: false
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
            allowNull: false
        },
        user_pincode: {
            type: DataTypes.STRING,
            allowNull: true, 
          },
        user_country: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_state: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        payment_type: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        proceed_to_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
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
    });
        // Sync model with database and set starting auto-increment for MySQL
        (async () => {
            await sequelize.sync();
            await sequelize.query('ALTER TABLE orders AUTO_INCREMENT = 10000;');
        })();
    return Order
}