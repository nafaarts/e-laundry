import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Unauthenticate from "../../components/Unauthenticate"
import { useAuth } from "../../context/AuthContext"
import { orderService } from "../../services/orderService"
import { currencyFormat } from "../../helpers/currencyFormat"
import { theme } from "../../core/theme"

const FilterButton = ({ category, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 10,
        marginRight: 5,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: category === selected ? theme.colors.primary : "#fff",
      }}
    >
      <Text style={{ textAlign: "center" }}>{category}</Text>
    </TouchableOpacity>
  )
}

export default function OrderScreen({ navigation }) {
  const { authData, getToken } = useAuth()
  const [isloading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [category, setCategory] = useState("PROSES")

  const getData = async () => {
    setIsLoading(true)
    orderService
      .getOrder(await getToken())
      .then((response) => {
        setData(response)
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false)
      })
  }

  const filterStatus = (item) =>
    category === "PROSES"
      ? item.status !== "SELESAI" && item.status !== "DIBATALKAN"
      : item.status === category

  useEffect(() => {
    if (authData) {
      const willFocusSubscription = navigation.addListener("focus", getData)
      return willFocusSubscription
    }
  }, [])

  if (!authData) {
    return <Unauthenticate navigation={navigation} />
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <View style={{ marginBottom: 10, flexDirection: "row" }}>
        <FilterButton
          category="PROSES"
          selected={category}
          onPress={() => {
            setCategory("PROSES")
          }}
        />
        <FilterButton
          category="SELESAI"
          selected={category}
          onPress={() => {
            setCategory("SELESAI")
          }}
        />
        <FilterButton
          category="DIBATALKAN"
          selected={category}
          onPress={() => {
            setCategory("DIBATALKAN")
          }}
        />
      </View>

      {isloading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : data?.filter(filterStatus).length !== 0 ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data?.filter(filterStatus).map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  navigation.push("OrderDetail", {
                    orderId: item.id,
                  })
                }}
              >
                <View
                  style={{
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 10,
                    backgroundColor: "white",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold" }}>{item.laundry}</Text>
                    </View>
                    <Text style={{ fontStyle: "italic" }}>{item.status}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{item.date_order}</Text>
                    <Text>{currencyFormat(item.price)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Tidak ada riwayat pesanan</Text>
        </View>
      )}
    </View>
  )
}
