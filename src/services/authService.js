import { axios } from "../api/axios.config"

const getMe = async (access_token) => {
  try {
    let response = await axios.get("/auth/me", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })

    return {
      name: response.data.name,
      email: response.data.email,
      phone_number: response.data.phone_number,
      profile_picture: response.data.profile_picture,
      token: access_token,
    }
  } catch (error) {
    console.error("error getting ME data : " + error)
  }
}

const register = async (name, email, phone_number, password) => {
  try {
    let response = await axios.post(
      "/auth/register",
      { name, email, phone_number, password, role: "user" },
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    return getMe(response.data.access_token)
  } catch (error) {
    console.error("error register data : " + error)
  }
}

const signIn = async (email, password) => {
  try {
    let response = await axios.post(
      "/auth/login",
      { email, password },
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    return getMe(response.data.access_token)
  } catch (error) {
    console.error("error getting signIn data : " + error)
  }
}

const logOut = async (access_token) => {
  try {
    let response = await axios.post(
      "/auth/logout",
      { email, password },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      },
    )

    return response.data.message
  } catch (error) {
    console.error("error getting signIn data : " + error)
  }
}

export const authService = {
  signIn,
  register,
  getMe,
  logOut,
}
