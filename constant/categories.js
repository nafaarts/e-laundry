import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons"

const category = [
  {
    id: "nearest",
    name: "Terdekat",
    icon: <MaterialIcons name="near-me" size={10} color="gray" />,
    iconActive: <MaterialIcons name="near-me" size={10} color="orange" />,
  },
  {
    id: "cheapest",
    name: "Termurah",
    icon: <Ionicons name="md-pricetag" size={10} color="gray" />,
    iconActive: <Ionicons name="md-pricetag" size={10} color="orange" />,
  },
  {
    id: "top-rated",
    name: "Bintang 4+",
    icon: <Ionicons name="md-star" size={10} color="gray" />,
    iconActive: <Ionicons name="md-star" size={10} color="orange" />,
  },
  {
    id: "pickup",
    name: "Pick Up",
    icon: <FontAwesome5 name="truck-pickup" size={10} color="gray" />,
    iconActive: <FontAwesome5 name="truck-pickup" size={10} color="orange" />,
  },
]

export default category
