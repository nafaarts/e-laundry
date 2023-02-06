import Axios from "axios"

// configure axios
export const axios = Axios.create({
  baseURL: "https://laundry.lpipb.com/api",
})
