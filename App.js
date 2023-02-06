import { Provider } from "react-native-paper"
import { theme } from "./src/core/theme"
import { StatusBar } from "expo-status-bar"
import Routes from "./src/routes/Routes"
import { AuthProvider } from "./src/context/AuthContext"
import { LocationProvider } from "./src/context/LocationContext"

export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <Provider theme={theme}>
          <StatusBar
            barStyle="default"
            backgroundColor={theme.colors.primary}
          />
          <Routes />
        </Provider>
      </AuthProvider>
    </LocationProvider>
  )
}
