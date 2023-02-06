import { axios } from "../api/axios.config"

const getOrder = async (token) => {
  try {
    let response = await axios.get(`/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("error getting order data : " + error)
  }
}

const getOrderById = async (token, id) => {
  try {
    let response = await axios.get(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("error getting laundry data : " + error)
  }
}

const makeOrder = async (token, data) => {
  try {
    let response = await axios.post(`/order`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("error getting laundry data : " + error)
  }
}

const cancelOrder = async (token, id, status) => {
  try {
    let response = await axios.put(
      `/order/${id}`,
      {
        type: "STATUS",
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("error getting order data : " + error)
  }
}

const submitUlasan = async (token, id, rating, comment) => {
  try {
    let response = await axios.put(
      `/order/${id}`,
      {
        type: "REVIEW",
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("error getting order data : " + error)
  }
}

export const orderService = {
  getOrder,
  getOrderById,
  makeOrder,
  cancelOrder,
  submitUlasan,
}
