import { axios } from "../api/axios.config"

const getAddress = async (token) => {
  try {
    let response = await axios.get(`/address`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("error getting address data : " + error)
  }
}

const addAddress = async (token, address) => {
  try {
    let response = await axios.post(
      "/address",
      {
        address,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error) {
    console.error("error inserting address data : " + error)
  }
}

const updateAddress = async (token, id, address) => {
  console.log({ token, id, address })
  try {
    let response = await axios.put(
      "/address/" + id,
      {
        address,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  } catch (error) {
    console.error("error updating address data : " + error)
  }
}

const deleteAddress = async (token, id) => {
  try {
    let response = await axios.delete(`/address/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response
  } catch (error) {
    console.error("error deleting address data : " + error)
  }
}

export const addressService = {
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
}
