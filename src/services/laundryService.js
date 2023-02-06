import { axios } from "../api/axios.config"

const getLaundry = async ({
  lat,
  long,
  page = 1,
  filter = "nearest",
  search = "",
}) => {
  try {
    let response = await axios.get(`/laundry`, {
      params: {
        lat: lat,
        lng: long,
        filter: filter,
        page: page,
        search: search,
      },
    })

    return response.data
  } catch (error) {
    console.error("error getting laundry data : " + error)
  }
}

const getLaundryById = async (lat, long, id) => {
  try {
    let response = await axios.get(`/laundry/${id}`, {
      params: {
        lat: lat,
        lng: long,
      },
    })

    return response.data
  } catch (error) {
    console.error("error getting laundry data : " + error)
  }
}

export const laundryService = {
  getLaundry,
  getLaundryById,
}
