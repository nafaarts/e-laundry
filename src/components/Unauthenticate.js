import { View, Text } from "react-native"
import { Button } from "react-native-paper"
import { theme } from "../core/theme"

const Unauthenticate = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 15,
          color: theme.colors.primary,
        }}
      >
        Opss! anda belum login!
      </Text>
      <Text
        style={{
          marginBottom: 30,
        }}
      >
        Silahkan Login terlebih dahulu.
      </Text>
      <Button
        mode="contained"
        icon="login"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
    </View>
  )
}

export default Unauthenticate
