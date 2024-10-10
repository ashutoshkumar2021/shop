import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { createOrder } from "./FetchApi";
import { fetchData } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
    if (!state.address) {
      setState({ ...state, error: "Please provide your address" });
      return;
    }
    if (!state.phone) {
      setState({ ...state, error: "Please provide your phone number" });
      return;
    }
    const options = {
      key:"rzp_test_MxxTLZcsyz7NhE" , // Replace with your Razorpay key
      amount: totalCost() * 100, // Convert to smallest currency unit
      currency: "INR",
      name: "Your Company Name",
      description: "Order Description",
      image: "https://your-logo-url.com/logo.jpg", // Replace with your logo
      handler: async (response) => {
        const orderData = {
          allProduct: JSON.parse(localStorage.getItem("cart")),
          user: JSON.parse(localStorage.getItem("jwt")).user._id,
          amount: response.razorpay_amount / 100, // Convert back to original amount
          transactionId: response.razorpay_payment_id,
          address: state.address,
          phone: state.phone,
        };

        try {
          const resposeData = await createOrder(orderData);
          if (resposeData.success) {
            localStorage.setItem("cart", JSON.stringify([]));
            dispatch({ type: "cartProduct", payload: null });
            dispatch({ type: "cartTotalCost", payload: null });
            dispatch({ type: "orderSuccess", payload: true });
            setState({ address: "", phone: "", error: false, success: true });
            history.push("/");
          } else if (resposeData.error) {
            console.log(resposeData.error);
          }
        } catch (error) {
          console.log(error);
        }
      },
      prefill: {
        name: "Customer Name", // Add customer name
        email: "customer@example.com", // Add customer email
        contact: state.phone,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Please wait until finished
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Order</div>
        {/* Product List */}
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts products={data.cartProduct} />
          </div>
          <div className="w-full order-first md:order-last md:w-1/2">
            <div className="p-4 md:p-8">
              {state.error && (
                <div className="bg-red-200 py-2 px-4 rounded">
                  {state.error}
                </div>
              )}
              <div className="flex flex-col py-2">
                <label htmlFor="address" className="pb-2">
                  Delivery Address
                </label>
                <input
                  value={state.address}
                  onChange={(e) =>
                    setState({ ...state, address: e.target.value, error: false })
                  }
                  type="text"
                  id="address"
                  className="border px-4 py-2"
                  placeholder="Address..."
                />
              </div>
              <div className="flex flex-col py-2 mb-2">
                <label htmlFor="phone" className="pb-2">
                  Phone
                </label>
                <input
                  value={state.phone}
                  onChange={(e) =>
                    setState({ ...state, phone: e.target.value, error: false })
                  }
                  type="number"
                  id="phone"
                  className="border px-4 py-2"
                  placeholder="+880"
                />
              </div>
              <div
                onClick={handlePayment}
                className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                style={{ background: "#303031" }}
              >
                Pay now
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
            >
              <div className="md:flex md:items-center md:space-x-4">
                <img
                  onClick={() => history.push(`/products/${product._id}`)}
                  className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                  src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                  alt="Product"
                />
                <div className="text-lg md:ml-6 truncate">{product.pName}</div>
                <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                  Price : ₹{product.pPrice}.00
                </div>
                <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                  Quantity : {quantity(product._id)}
                </div>
                <div className="font-semibold text-gray-600 text-sm">
                  Subtotal : ₹{subTotal(product._id, product.pPrice)}.00
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No products found for checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;