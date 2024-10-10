// import { createOrder, } from "./FetchApi";

// export const fetchData = async (cartListProduct, dispatch) => {
//   dispatch({ type: "loading", payload: true });
//   try {
//     let responseData = await cartListProduct();
//     if (responseData && responseData.Products) {
//       setTimeout(function () {
//         dispatch({ type: "cartProduct", payload: responseData.Products });
//         dispatch({ type: "loading", payload: false });
//       }, 1000);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const fetchbrainTree = async (getBrainTreeToken, setState) => {
//   try {
//     let responseData = await getBrainTreeToken();
//     if (responseData && responseData) {
//       setState({
//         clientToken: responseData.clientToken,
//         success: responseData.success,
//       });
//       console.log(responseData);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const pay = async (
//   data,
//   dispatch,
//   state,
//   setState,
//   getPaymentProcess,
//   totalCost,
//   history
// ) => {
//   console.log(state);
//   if (!state.address) {
//     setState({ ...state, error: "Please provide your address" });
//   } else if (!state.phone) {
//     setState({ ...state, error: "Please provide your phone number" });
//   } else {
//     let nonce;
//     state.instance
//       .requestPaymentMethod()
//       .then((data) => {
//         dispatch({ type: "loading", payload: true });
//         nonce = data.nonce;
//         let paymentData = {
//           amountTotal: totalCost(),
//           paymentMethod: nonce,
//         };
//         getPaymentProcess(paymentData)
//           .then(async (res) => {
//             if (res) {
//               let orderData = {
//                 allProduct: JSON.parse(localStorage.getItem("cart")),
//                 user: JSON.parse(localStorage.getItem("jwt")).user._id,
//                 amount: res.transaction.amount,
//                 transactionId: res.transaction.id,
//                 address: state.address,
//                 phone: state.phone,
//               };
//               try {
//                 let resposeData = await createOrder(orderData);
//                 if (resposeData.success) {
//                   localStorage.setItem("cart", JSON.stringify([]));
//                   dispatch({ type: "cartProduct", payload: null });
//                   dispatch({ type: "cartTotalCost", payload: null });
//                   dispatch({ type: "orderSuccess", payload: true });
//                   setState({ clientToken: "", instance: {} });
//                   dispatch({ type: "loading", payload: false });
//                   return history.push("/");
//                 } else if (resposeData.error) {
//                   console.log(resposeData.error);
//                 }
//               } catch (error) {
//                 console.log(error);
//               }
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((error) => {
//         console.log(error);
//         setState({ ...state, error: error.message });
//       });
//   }
// };

import { createOrder, getRazorpayOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchRazorpayOrder = async (amount, setState) => {
  try {
    const amount=500;
    let responseData = await getRazorpayOrder(amount);
    if (responseData && responseData) {
      setState({ orderId: responseData.id,
        success: responseData.success
       });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    const options = {
      key: "rzp_test_MxxTLZcsyz7NhE", // Your Razorpay key ID
      amount: totalCost() * 100, // Amount in paisa
      currency: "INR",
      name: "Your Store Name",
      description: "Order Description",
      order_id: state.orderId, // Set this from the order created
      handler: async (response) => {
        let paymentData = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res) {
              let orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")),
                user: JSON.parse(localStorage.getItem("jwt")).user._id,
                amount: totalCost()*100,
                transactionId: res.id,
                address: state.address,
                phone: state.phone,
              };
              try {
                let responseData = await createOrder(orderData);
                if (responseData.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ orderId: "" });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (responseData.error) {
                  console.log(responseData.error);
                }
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      prefill: {
        name: state.name,
        email: state.email,
        contact: state.phone,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }
};