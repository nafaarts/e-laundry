import { useEffect, useState, useCallback } from "react"
import { ScrollView, Text, View, RefreshControl, Alert } from "react-native"
import { Button, IconButton } from "react-native-paper"
import { useAuth } from "../../context/AuthContext"
import { addressService } from "../../services/addressService"

const AddressCard = ({ id, no, address, onUpdate, onDelete }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 5,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, padding: 10 }}>
        <Text>Alamat {no}</Text>
        <Text style={{ color: "gray", marginTop: 5 }}>{address}</Text>
      </View>
      <IconButton icon="pencil" onPress={onUpdate} color="gray" size={20} />
      <IconButton icon="delete" onPress={onDelete} color="red" size={20} />
    </View>
  )
}

const AddButton = ({ onPress }) => {
  return (
    <Button
      icon="plus"
      mode="outlined"
      onPress={onPress}
      style={{ paddingVertical: 8, marginTop: 5 }}
    >
      Tambah alamat baru
    </Button>
  )
}

export default function AddressScreen({ navigation }) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { getToken } = useAuth()
  let token

  const getData = async () => {
    setIsLoading(true)
    try {
      token = await getToken()
      let response = await addressService.getAddress(token)
      setData(response)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const onDelete = (id) => {
    Alert.alert("Confirmation", "Yakin mau hapus alamat ini?", [
      {
        text: "Batal",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Ya",
        onPress: async () => {
          try {
            token = await getToken()
            await addressService.deleteAddress(token, id)
            getData()
          } catch (error) {
            console.error(error)
          }
        },
      },
    ])
  }

  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", getData)
    return willFocusSubscription
  }, [])

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => getData()} />
        }
      >
        {data.length === 0 ? (
          <View
            style={{
              paddingVertical: 40,
              backgroundColor: "white",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 14,
                marginBottom: 10,
                color: "gray",
              }}
            >
              Tidak ada data alamat
            </Text>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 12 }}>
              Silahkan tambah alamat pada tombol dibawah
            </Text>
          </View>
        ) : (
          data.map((item, index) => (
            <AddressCard
              key={index}
              no={index + 1}
              id={item.id}
              address={item.address}
              onUpdate={() =>
                navigation.navigate("AddressUpdate", {
                  addressId: item.id,
                  userAddress: item.address,
                })
              }
              onDelete={() => onDelete(item.id)}
            />
          ))
        )}

        <AddButton onPress={() => navigation.push("AddressInsert")} />
      </ScrollView>
    </View>
  )
}
