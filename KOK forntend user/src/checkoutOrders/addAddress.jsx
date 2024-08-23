import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import axios from 'axios';

const inputStyle = {
    marginBottom: '16px',
};

const { TextArea } = Input;

const AddAddress = ({ openAddModal, setOpenAddModal, handleAddressAdd }) => {

    const [state, setState] = useState({
        user_first_name: "",
        user_last_name: "",
        user_mobile_no: "",
        user_address: "",
        user_pincode: "",
        user_country: "",
        user_state: "",
    });

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/User/addAddress`,
                state,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("auth_token"),
                    },
                }
            );
            handleAddressAdd(response.data.data);
            setState({
                user_first_name: "",
                user_last_name: "",
                user_mobile_no: "",
                user_address: "",
                user_pincode: "",
                user_country: "",
                user_state: "",
            });
            setOpenAddModal(false);
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    return (
        <>
            <Modal
                title="Add Address"
                visible={openAddModal}
                onCancel={handleClose}
                footer={[
                    <Button key="save" onClick={handleSave}>Save</Button>
                ]}
            >
                <Input
                    name="user_first_name"
                    placeholder="First Name"
                    value={state.user_first_name}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <Input
                    name="user_last_name"
                    placeholder="Last Name"
                    value={state.user_last_name}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <Input
                    name="user_mobile_no"
                    placeholder="Mobile Number"
                    value={state.user_mobile_no}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <TextArea
                    name="user_address"
                    placeholder="Address"
                    value={state.user_address}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <Input
                    name="user_pincode"
                    placeholder="Pincode"
                    value={state.user_pincode}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <Input
                    name="user_state"
                    placeholder="State"
                    value={state.user_state}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <Input
                    name="user_country"
                    placeholder="Country"
                    value={state.user_country}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </Modal>
        </>
    );
};

export default AddAddress;
