import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Button, Result } from "antd";
import "jspdf-autotable";
import "./CheckoutOrders.css";
import logo from "./assets/img/Logo.png";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order_id } = location.state || {};

  const [orderData, setOrderData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/pdfgenerate`,
        { order_id },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (order_id) {
      fetchData();
    }
  }, [order_id]);

  const handleGeneratePdf = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 10;
    const rightMargin = 10;
    const centerX = pageWidth / 2;

    // Add company logo
    doc.addImage(logo, "PNG", 10, 10, 50, 20);

    // Add business name and customer details in one row with space-between
    doc.setFontSize(18);
    doc.text("Business Name", 10, 40);
    doc.text("Bill To:", pageWidth - rightMargin, 40, { align: "right" });

    doc.setFontSize(12);
    const customerDetails = `${orderData.user_first_name} ${orderData.user_last_name}\n${orderData.user_address}\n${orderData.user_state}, ${orderData.user_country}, ${orderData.user_pincode}\nMobile: ${orderData.user_mobile_no}`;
    const customerDetailsX = pageWidth - rightMargin;
    const customerDetailsY = 50;
    doc.text(customerDetails, customerDetailsX, customerDetailsY, {
      align: "right",
    });

    // Add invoice details
    doc.text(`Invoice No: ${orderData.order_id}`, 10, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 60);

    // Add product details as a table
    const tableColumn = [
      "Product Name",
      "Description",
      "Tax",
      "GST",
      "Price",
      "Quantity",
      "Total",
    ];
    const tableRows = [];

    let totalPrice = 0;
    let totalTaxOrGst = 0;

    orderData.subData.forEach((subItem) => {
      const productData = subItem.productdata[0];
      const quantity = subItem.product_quantity;

      let totalTax = 0;
      let totalGst = 0;

      // Calculate total tax if Product_tax is defined
      if (productData.Product_tax !== undefined) {
        totalTax = productData.Product_tax * quantity;
      }

      // Calculate total GST if GST is defined
      if (productData.GST !== undefined) {
        totalGst =
          (((subItem.product_price / quantity) * productData.GST) / 100) *
          quantity;
      }

      // Calculate total price for the item
      const itemTotalPrice = totalTax + totalGst + subItem.product_price;
      totalPrice += itemTotalPrice;

      // Accumulate total tax or GST for the order
      totalTaxOrGst += totalTax + totalGst;

      const productDetails = [
        productData.product_name,
        productData.product_description,
        totalTax.toFixed(2),
        productData.GST + "%",
        subItem.product_price.toFixed(2),
        subItem.product_quantity,
        itemTotalPrice.toFixed(2),
      ];
      tableRows.push(productDetails);
    });

    // Add total tax and total GST row
    const totalTaxRow = [
      "Total Tax And Gst",
      "",
      "",
      "",
      "",
      "",
      totalTaxOrGst.toFixed(2),
    ];
    tableRows.push(totalTaxRow);

    // Add shipping charge
    const shippingCharge =
      orderData.subData[0].productdata[0].shipping_charge || 0;
    const shippingChargeRow = [
      "Shipping Charge",
      "",
      "",
      "",
      "",
      "",
      shippingCharge.toFixed(2),
    ];
    tableRows.push(shippingChargeRow);

    // Calculate total payable amount
    const totalPayableAmt = totalPrice + shippingCharge;
    const totalPriceRow = [
      "Total Payable Amt",
      "",
      "",
      "",
      "",
      "",
      totalPayableAmt.toFixed(2),
    ];
    tableRows.push(totalPriceRow);

    // Generate the table
    doc.autoTable({
      startY: 70,
      head: [tableColumn],
      body: tableRows,
    });

    // Save the PDF
    doc.save("order-summary.pdf");
  };

  const handleNeviget = () => {
    navigate("/");
  };

  return (
    <>
      {/* <div className="checkout-container">
        <div className="pdf-btn">
          <button
            type="submit"
            className="generate-pdf-btn"
            onClick={handleGeneratePdf}
          >
            Generate Pdf
          </button>
        </div>
      </div> */}

      <Result
        status="success"
        title="Your order placed successfully"
        extra={[
          <Button key="buy" onClick={handleNeviget}>
            Shopping continue
          </Button>,
          <Button type="primary" key="console" onClick={handleGeneratePdf}>
            Generate Pdf
          </Button>,
        ]}
      />
    </>
  );
};

export default OrderSuccess;
