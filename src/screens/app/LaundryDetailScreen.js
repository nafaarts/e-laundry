import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native"
import Background from "../../components/Background"
import Heading from "../../components/Heading"
import Pickup from "../../components/Pickup"
import Rate from "../../components/Rate"
import { useAuth } from "../../context/AuthContext"
import { useLocation } from "../../context/LocationContext"
import { theme } from "../../core/theme"
import { currencyFormat } from "../../helpers/currencyFormat"
import { laundryService } from "../../services/laundryService"

export default function LaundyDetailScreen({ navigation, route }) {
  const ID = route.params.laundryId

  const { location, errorMsg } = useLocation()

  const { authData } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  const getData = async () => {
    setIsLoading(true)

    try {
      let response = await laundryService.getLaundryById(
        location?.coords.latitude,
        location?.coords.longitude,
        ID,
      )
      setData(response)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (isLoading) {
    return (
      <Background>
        <ActivityIndicator size="large" />
      </Background>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 20,
          borderWidth: 0.3,
          borderColor: "gray",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: "white",
            borderRadius: 50,
            overflow: "hidden",
            marginRight: 20,
            backgroundColor: "lightgray",
          }}
        >
          <Image
            source={{
              uri: data?.image,
            }}
            style={{
              height: 100,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18, flexWrap: "wrap" }}>
            {data?.name}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {data?.district}, {data?.city}
          </Text>
          {data?.rate !== 0 && <Rate rate={data?.rate} />}
          <Text style={{ fontSize: 12, color: "gray" }}>
            Sekitar {data?.distance} KM dari lokasi anda.
          </Text>
          <Pickup show={parseInt(data?.has_pickup)} />
        </View>
      </View>
      <View style={{ flex: 6 }}>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 20 }}>
              <Heading text="Paling diminati" />
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {data?.services
                  .sort((a, b) => b.orders - a.orders)
                  .slice(0, 3)
                  .map((item, index) => (
                    <View
                      style={{
                        flex: 1 / 3,
                        padding: 5,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          borderWidth: 0.3,
                          borderColor: "gray",
                          borderRadius: 5,
                          alignItems: "center",
                          paddingVertical: 15,
                        }}
                      >
                        <View
                          style={{
                            height: 80,
                            width: 80,
                            overflow: "hidden",
                            borderRadius: 5,
                          }}
                        >
                          <Image
                            source={{
                              uri: item?.icon,
                            }}
                            style={{
                              width: 80,
                              height: 80,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 12,
                            marginTop: 10,
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            marginTop: 5,
                            color: "gray",
                          }}
                        >
                          {currencyFormat(item.price)}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Heading text="Layanan lainnya" />
              <View
                style={{
                  marginTop: 10,
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                {data?.services.map((item, index) => {
                  return (
                    <View
                      style={{
                        width: "25%",
                        padding: 3,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          borderWidth: 0.3,
                          borderColor: "gray",
                          borderRadius: 5,
                          alignItems: "center",
                          paddingVertical: 15,
                        }}
                      >
                        <View
                          style={{
                            width: 50,
                            height: 50,
                            overflow: "hidden",
                            borderRadius: 5,
                          }}
                        >
                          <Image
                            source={{
                              uri: item?.icon,
                            }}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            marginTop: 10,
                            textAlign: "center",
                          }}
                        >
                          {item?.name}
                        </Text>
                        <Text
                          style={{ fontSize: 10, marginTop: 5, color: "gray" }}
                        >
                          {currencyFormat(item.price)}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Heading text="Detail Laundry" />
              <View
                style={{
                  borderWidth: 0.3,
                  borderColor: "gray",
                  borderRadius: 5,
                  padding: 20,
                  marginTop: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
                  Owner :
                </Text>
                <Text>{data?.user.name}</Text>
                <Text
                  style={{ fontWeight: "bold", marginBottom: 3, marginTop: 10 }}
                >
                  Address :
                </Text>
                <Text>{data?.address}</Text>
                <Text
                  style={{ fontWeight: "bold", marginBottom: 3, marginTop: 10 }}
                >
                  No. Izin :
                </Text>
                <Text>{data?.no_izin}</Text>
                <Text
                  style={{ fontWeight: "bold", marginBottom: 3, marginTop: 10 }}
                >
                  No. Telp :
                </Text>
                <Text>{data?.user.phone_number}</Text>
                {data?.rate !== 0 && (
                  <>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginBottom: 3,
                        marginTop: 10,
                      }}
                    >
                      Rating :
                    </Text>
                    <Rate rate={data?.rate ?? 0} />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                borderWidth: 1,
                padding: 5,
                flex: 1,
                alignItems: "center",
                margin: 5,
                borderRadius: 5,
                borderColor: "gray",
              }}
            >
              <FontAwesome name="arrow-left" size={22} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${data?.user.phone_number}`)
              }}
              style={{
                borderWidth: 1,
                padding: 5,
                flex: 1,
                alignItems: "center",
                margin: 5,
                borderRadius: 5,
                borderColor: "gray",
              }}
            >
              <FontAwesome name="phone" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (authData) {
                  navigation.navigate("LaundryOrder", {
                    laundryId: ID,
                    location,
                  })
                } else {
                  Alert.alert(
                    "Anda belum Login!",
                    "silahkan login terlebih dahulu.",
                    [
                      {
                        text: "Login",
                        onPress: () => {
                          navigation.navigate("LoginScreen")
                        },
                      },
                      {
                        text: "Nanti",
                        onPress: () => {},
                        style: "Nanti",
                      },
                    ],
                  )
                }
              }}
              style={{
                padding: 5,
                flex: 1,
                alignItems: "center",
                margin: 5,
                borderRadius: 5,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Pesan Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
