import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// export const getBrainTreeToken = async () => {
//   let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
//   try {
//     let res = await axios.post(${apiURL}/api/braintree/get-token, {
//       uId: uId,
//     });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const getRazorpayOrder = async (amount) => {
  try {
    let res = await axios.post(`${apiURL}/api/razorpay/order`, { amount });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};


export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/razorpay/verify`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    console.log(orderData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};