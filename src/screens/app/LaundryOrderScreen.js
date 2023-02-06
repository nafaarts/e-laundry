import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
  Text,
  View,
  Switch,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { TextInput } from "react-native-paper"
import { useAuth } from "../../context/AuthContext"
import { theme } from "../../core/theme"
import { currencyFormat } from "../../helpers/currencyFormat"
import { laundryService } from "../../services/laundryService"
import { SelectList } from "react-native-dropdown-select-list"
import { addressService } from "../../services/addressService"
import { orderService } from "../../services/orderService"
import { useLocation } from "../../context/LocationContext"

const FormControl = ({ children, label }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>{label}</Text>
      {children}
    </View>
  )
}

const ServiceCard = ({ item, isSelected, handlePress }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? theme.colors.primary : "gray",
        borderRadius: 4,
        padding: 15,
        margin: isSelected ? 1 : 2,
        marginRight: 10,
      }}
    >
      <View
        style={{
          height: 50,
          width: 50,
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
      <View style={{ marginLeft: 10 }}>
        <Text
          style={{
            fontSize: 14,
          }}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 5, color: "gray" }}>
          {currencyFormat(item.price)}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function LaundryOrderScreen({ navigation, route }) {
  const ID = route.params.laundryId

  const { location } = useLocation()

  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [selectedService, setSelectedService] = useState({
    id: 0,
    price: 0,
    unit: "KG",
  })
  const [address, setAddress] = useState("")
  const [dropDownData, setDropDownData] = useState([])

  const [totalPrice, setTotalPrice] = useState(0)
  const [weight, setWeight] = useState(0)

  const getData = async () => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      let response = await laundryService.getLaundryById(
        location?.coords.latitude,
        location?.coords.longitude,
        ID,
      )
      setData(response)
      setSelectedService({
        id: response?.services.sort((a, b) => a.price - b.price)[0].id,
        price: response?.services.sort((a, b) => a.price - b.price)[0].price,
        unit: response?.services.sort((a, b) => a.price - b.price)[0].unit,
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  const getAddressData = async () => {
    try {
      let token = await getToken()
      let response = await addressService.getAddress(token)

      setDropDownData(
        response.map((item, index) => {
          return {
            key: item.id,
            value: item.address,
          }
        }),
      )
    } catch (error) {
      console.error(error)
    }
  }

  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      if (!previousState) getAddressData()
      return !previousState
    })
  }

  const handleOrder = async () => {
    if (weight === 0) {
      Alert.alert("Opss!", "mohon lengkapi data pesanan anda!")
      return
    }

    if (isEnabled && !address) {
      Alert.alert("Opss!", "Silahkan masukan alamat anda!")
      return
    }

    Alert.alert(
      "Konfirmasi Pesanan",
      `Konfirmasi pesanan anda sebesar ${currencyFormat(totalPrice)} ?`,
      [
        {
          text: "Batal",
          onPress: () => {},
        },
        {
          text: "Konfirmasi",
          onPress: async () => {
            try {
              let token = await getToken()
              let response = await orderService.makeOrder(token, {
                laundry_id: ID,
                with_pick_up: isEnabled,
                address_id: isEnabled ? address : null,
                lat: location?.coords.latitude,
                long: location?.coords.longitude,
                detail_order: [
                  {
                    service_id: selectedService.id,
                    weight,
                  },
                ],
              })
              if (response) {
                Alert.alert(
                  "Terima Kasih",
                  `Pesanan anda telah dibuat, ${
                    isEnabled
                      ? "mohon tunggu pakaian anda dijemput"
                      : `Silahkan antar pakaian anda ke ${data?.name}`
                  }`,
                )
                navigation.navigate("Orders")
              }
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    )
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    setTotalPrice(selectedService.price * weight)
  }, [selectedService, weight])

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 30, paddingTop: 30 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormControl label="Laundry">
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data?.name}
            </Text>
          </FormControl>

          <FormControl label={`Jumlah (${selectedService.unit})`}>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              placeholder="Masukan jumlah pesanan anda."
              value={weight}
              onChangeText={(text) => setWeight(text ? parseInt(text) : 0)}
            />
          </FormControl>

          <FormControl label="Layanan">
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {data?.services
                  .sort((a, b) => a.price - b.price)
                  .map((item, index) => (
                    <ServiceCard
                      key={index}
                      item={item}
                      isSelected={selectedService.id === item.id}
                      handlePress={() =>
                        setSelectedService({
                          id: item.id,
                          price: item.price,
                          unit: item.unit,
                        })
                      }
                    />
                  ))}
              </View>
            </ScrollView>
          </FormControl>

          {data?.has_pickup === "1" && (
            <View style={{ marginBottom: 20 }}>
              <FormControl label="Antar / Jemput">
                <View style={{ alignItems: "flex-start" }}>
                  <Switch
                    thumbColor={isEnabled ? theme.colors.primary : "#f4f3f4"}
                    ios_backgroundColor="#d3d3d3"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </FormControl>

              {isEnabled &&
                (dropDownData.length === 0 ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>Anda belum memiliki alamat!</Text>
                    <TouchableOpacity
                      style={{ marginLeft: 5 }}
                      onPress={() => {
                        navigation.navigate("Address")
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: "bold",
                        }}
                      >
                        Tambah Alamat
                        <FontAwesome name="arrow-right" />
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FormControl label="Alamat">
                    <SelectList
                      setSelected={(val) => setAddress(val)}
                      data={dropDownData}
                      notFoundText="Silahkan masukan alamat anda terlebih dahulu!"
                      save="key"
                    />
                  </FormControl>
                ))}
            </View>
          )}
        </ScrollView>
      </View>

      <View
        style={{
          height: 200,
          backgroundColor: theme.colors.primary,
          borderTopStartRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 14, color: "white" }}>Total pesanan : </Text>
          <Text style={{ fontSize: 25, color: "white" }}>
            {currencyFormat(totalPrice)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOrder}
          style={{
            alignItems: "center",
            borderRadius: 5,
            padding: 10,
            backgroundColor: "white",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Buat Pesanan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
