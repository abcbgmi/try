import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import axios from 'axios';

const Order = ({ open, setOpen, loading, setLoading, orderIdGet }) => {

    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        if (!loading && open && orderIdGet) {
            setLoading(false);
        }
    }, [loading, open, setLoading, orderIdGet]);

    const handleProductClick = async (productId, item) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
                { product_id: productId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("auth_token"),
                    },
                }
            );
            setProductDetails(response.data.data);
            navigate(`/bagAddToCart`, {
                state: {
                    productId: productId,
                    mycartId: item.mycart_id,
                    productModifyObject: item.product_modify_object
                }
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
            setLoading(false);
        }
    };

    const parseProductModifyObject = (jsonString) => {
        try {
            const parsedObject = JSON.parse(JSON.parse(jsonString));
            const formattedObject = {};

            Object.keys(parsedObject).forEach((key) => {
                if (typeof parsedObject[key] === 'object') {
                    formattedObject[key] = parsedObject[key].color || parsedObject[key].charmName;
                } else {
                    formattedObject[key] = parsedObject[key];
                }
            });

            return formattedObject;
        } catch (error) {
            console.error('Error parsing product_modify_object:', error);
            return {};
        }
    };

    return (
        <Modal
            title="Order Details"
            visible={open}
            footer={
                <Button type="primary" style={{ display: "none" }}>
                    Save
                </Button>
            }
            onCancel={() => setOpen(false)}
        >
            {orderIdGet ? (
                <>
                    <div>
                        {orderIdGet.subData.map((item, index) => (
                            <div key={index}>
                                <div className="order-summary">
                                    <div>
                                        {item.productdata[0].imagelink && (
                                            <img
                                                src={item.productdata[0].imagelink}
                                                alt={item.productdata[0].product_name}
                                                className="product-img"
                                                style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
                                                onClick={() => handleProductClick(item.product_id, item)}
                                            />
                                        )}
                                    </div>
                                    <h5 className="product-name">
                                        {item.productdata[0]?.product_name}
                                    </h5>
                                    <div>
                                        <p className="qty">Qty: {item.product_quantity}</p>
                                        <p className="amount">Price: {item.product_price} Rs.</p>
                                    </div>
                                </div>
                                <div>
                                    {item.product_modify_object && (
                                        <div>
                                            {Object.entries(parseProductModifyObject(item.product_modify_object)).map(([key, value], index) => (
                                                <p key={index}>{key}: {value}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <p>Order ID: {orderIdGet.order_id}</p>
                        <p>Order Total: {orderIdGet.order_total}</p>
                        <p>Payment Type: {orderIdGet.payment_type || "N/A"}</p>
                        <p>User Details:</p>
                        <p>Order Status: {orderIdGet?.orderstatus}</p>
                        <p>{orderIdGet.user_first_name} {orderIdGet.user_last_name}</p>
                        <p>{orderIdGet.user_address}</p>
                        <p>{orderIdGet.user_country}</p>
                        <p>{orderIdGet.user_state}, {orderIdGet.user_pincode}</p>
                        <p>Mobile: {orderIdGet.user_mobile_no}</p>
                    </div>
                </>
            ) : (
                <p>No order details found.</p>
            )}
        </Modal>
    );
};

export default Order;
