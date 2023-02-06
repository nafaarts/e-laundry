import { FontAwesome } from "@expo/vector-icons"
import { Text, View } from "react-native"

const EmptyList = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <FontAwesome name="times" size={24} color="gray" />
      <Text style={{ fontSize: 18, marginVertical: 10, color: "gray" }}>
        Opps! Tidak ada data!
      </Text>
    </View>
  )
}

export default EmptyList
