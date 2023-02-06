import React, { createContext, useState, useContext, useEffect } from "react"
import * as Location from "expo-location"

const LocationContext = createContext()

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    ;(async () => {
      console.info("Getting location..")
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Mohon izinkan penggunaan lokasi anda.")
          return
        }

        let location = await Location.getCurrentPositionAsync({})
        setLocation(location)
        setErrorMsg(null)
      } catch (error) {
        setErrorMsg("Terdapat kesalahan dalam mengambil informasi lokasi anda")
      }
    })()
  }, [])

  return (
    <LocationContext.Provider value={{ location, errorMsg }}>
      {children}
    </LocationContext.Provider>
  )
}

function useLocation() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error("useLocation must be used within an LocationProvider")
  }

  return context
}

export { LocationContext, LocationProvider, useLocation }
