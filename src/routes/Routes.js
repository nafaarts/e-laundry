import { NavigationContainer } from "@react-navigation/native"
import { useEffect, useState } from "react"
import SplashScreen from "../screens/auth/SplashScreen"
import { AppStack } from "./AppStack"

export default function Routes() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  )
}
