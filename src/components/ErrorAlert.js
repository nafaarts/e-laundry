import { FontAwesome5 } from "@expo/vector-icons"
import { View, Text } from "react-native"

export default function ErrorAlert({ text }) {
  return (
    <View
      style={{
        backgroundColor: "pink",
        flexDirection: "row",
        padding: 15,
        marginVertical: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
      }}
    >
      <FontAwesome5 name="times" size={18} color="red" />
      <Text style={{ color: "red", marginLeft: 10 }}>{text}</Text>
    </View>
  )
}
