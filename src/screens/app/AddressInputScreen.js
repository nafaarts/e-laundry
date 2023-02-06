import { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { useAuth } from "../../context/AuthContext"
import { addressService } from "../../services/addressService"

const AddButton = ({ onPress, isLoading }) => {
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
      icon="plus"
      mode="contained"
      onPress={onPress}
      style={{ paddingVertical: 8, marginTop: 10 }}
      disabled={isLoading}
    >
      Submit
    </Button>
  )
}

export default function AddressInputScreen({ navigation }) {
  const [address, setAddress] = useState("")
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
      let response = await addressService.addAddress(token, address)

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
        onChangeText={(text) => setAddress(text)}
      />
      <AddButton onPress={onSubmit} isLoading={isLoading} />
    </View>
  )
}
