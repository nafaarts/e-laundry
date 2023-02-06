import { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { useAuth } from "../../context/AuthContext"
import { addressService } from "../../services/addressService"

const SubmitButton = ({ onPress, isLoading }) => {
  return isLoading ? (
    <Button
      mode="contained"
      disabled={true}
      style={{ paddingVertical: 5, marginTop: 10, alignItems: "center" }}
    >
      <ActivityIndicator color="#000" />
    </Button>
  ) : (
    <Button
      icon="pencil"
      mode="contained"
      onPress={onPress}
      style={{ paddingVertical: 8, marginTop: 10 }}
      disabled={isLoading}
    >
      Ubah
    </Button>
  )
}

export default function AddressUpdateScreen({ route, navigation }) {
  const { addressId, userAddress } = route.params
  console.log(route.params)

  const [address, setAddress] = useState(userAddress)
  const [isLoading, setIsLoading] = useState(false)

  const { getToken } = useAuth()

  const onSubmit = async () => {
    if (!address.trim()) {
      alert("Alamat tidak boleh kosong!")
      return
    }
    setIsLoading(true)
    try {
      let token = await getToken()
      let response = await addressService.updateAddress(
        token,
        addressId,
        address,
      )

      if (response) {
        navigation.navigate("Address")
      }
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ backgroundColor: "white", height: 150 }}
        multiline={true}
        numberOfLines={4}
        placeholder="Masukan Alamat Lengkap"
        underlineColor="transparent"
        outlineColor="lightgray"
        mode="outlined"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
      <SubmitButton onPress={onSubmit} isLoading={isLoading} />
    </View>
  )
}
