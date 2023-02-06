import { View, TouchableOpacity, Text, Image } from "react-native"
import Rate from "../components/Rate"
import { theme } from "../core/theme"
import { currencyFormat } from "../helpers/currencyFormat"
import Pickup from "./Pickup"

export default function LaundryCard({ data, action }) {
  return (
    <TouchableOpacity onPress={action} style={{ marginVertical: 5 }}>
      <View
        style={{
          flexDirection: "row",
          borderWidth: 0.5,
          borderRadius: 15,
          borderColor: "lightgray",
          padding: 10,
        }}
      >
        <View
          style={{
            width: "30%",
            borderRadius: 10,
            marginRight: 10,
            overflow: "hidden",
            backgroundColor: "lightgray",
          }}
        >
          <Image
            source={{
              uri: data.image,
            }}
            style={{
              flex: 1,
              width: undefined,
              height: undefined,
              resizeMode: "cover",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: "gray" }}>{data.distance} KM</Text>
            <Pickup show={parseInt(data.has_pickup)} />
          </View>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {data.name}
          </Text>
          {data.rate !== 0 && <Rate rate={data.rate} />}
          <Text style={{ color: "gray", marginTop: 8 }}>
            Harga mulai {currencyFormat(data.cheapest_price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
