import { FontAwesome5 } from "@expo/vector-icons"
import { View, Text } from "react-native"

export default function Pickup({ show }) {
  return (
    <View
      style={{
        display: show ? "flex" : "none",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: "orange",
        alignSelf: "flex-start",
      }}
    >
      <FontAwesome5 name="truck-pickup" size={10} color="white" />
      <Text
        style={{
          fontSize: 10,
          marginLeft: 5,
          color: "white",
          fontWeight: "bold",
        }}
      >
        Pick Up
      </Text>
    </View>
  )
}
