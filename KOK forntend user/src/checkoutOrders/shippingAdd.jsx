import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Modal } from 'antd';
import axios from 'axios';
import AddAddress from './addAddress';

const ShippingAdd = ({ open, setOpen, setSelectedShippingAddress, handleAddressAdd }) => {

    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [data, setData] = useState([]);

    // Fetch address data
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/User/userAddressFill`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("auth_token"),
                    },
                }
            );
            setData(response.data.AnotherAddress);
        } catch (error) {
            console.error("Error fetching address data:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateAdd = () => {
        setOpen(false);
        setOpenAddModal(true);
    };

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedAddress(value);
    };

    const handleSave = () => {
        const selectedAddr = data.find(addr => addr.user_adress_id === parseInt(selectedAddress));
        setSelectedShippingAddress(selectedAddr);
        handleAddressAdd(selectedAddr);
        setOpen(false);
    };

    const handleAddressAddLocal = (newAddress) => {
        handleAddressAdd(newAddress);
        setOpenAddModal(false);
    };

    return (
        <>
            <Modal
                title="Shipping Address"
                visible={open}
                onCancel={handleClose}
                footer={[
                    <div className='footer-btn' key="footer-btn">
                        <Link key="create" onClick={handleCreateAdd}>Create a New Address</Link>
                        <div>
                            <Button key="close" onClick={handleClose}>Close</Button>
                            <Button key="save" onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                ]}
                bodyStyle={{ maxHeight: '50vh', overflowY: 'auto' }}
            >
                {data.map(addr => (
                    <div key={addr.user_adress_id}>
                        <Checkbox
                            value={addr.user_adress_id.toString()}
                            onChange={handleCheckboxChange}
                            checked={selectedAddress === addr.user_adress_id.toString()}
                        >
                            {addr.user_first_name} {addr.user_last_name}
                        </Checkbox>
                        <div>
                            <p className='Add-p'>{addr.user_address}</p>
                            <p className='Add-p'>{addr.user_state}, {addr.user_country} - {addr.user_pincode}</p>
                            <p className='Add-p'>{addr.user_mobile_no}</p>
                        </div>
                        <hr />
                    </div>
                ))}
            </Modal>
            <AddAddress
                openAddModal={openAddModal}
                setOpenAddModal={setOpenAddModal}
                handleAddressAdd={handleAddressAddLocal}
            />
        </>
    );
};

export default ShippingAdd;
