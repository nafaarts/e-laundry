import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

export default function Rate({ rate, props }) {
  const rows = []
  for (let i = 0; i < rate; i++) {
    rows.push(<Ionicons name="star" size={12} key={i} color="orange" />)
  }
  if (rate < 5) {
    for (let i = 0; i < 5 - rate; i++) {
      rows.push(
        <Ionicons name="star" size={12} key={rate + i + 1} color="gray" />,
      )
    }
  }
  return (
    <View style={{ flexDirection: "row" }} {...props}>
      {rows}
    </View>
  )
}
