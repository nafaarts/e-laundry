import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native"
import ProfilPicture from "../../components/ProfilePicture"
import Unauthenticate from "../../components/Unauthenticate"
import { useAuth } from "../../context/AuthContext"
import { authService } from "../../services/authService"
import * as ImagePicker from "expo-image-picker"
import FormData from "form-data"

const createFormData = (photo, body = {}) => {
  const data = new FormData()
  const fileName = photo.uri.split("/").pop()
  data.append("profile_picture", {
    name: fileName,
    fileName: fileName.split(".")[0],
    type: photo.type + `/${fileName.split(".")[1]}`,
    uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  })
  return data
}

export default function ProfileScreen({ navigation }) {
  const { authData, getToken, signOut } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [photo, setPhoto] = useState(null)

  const getData = async () => {
    try {
      setLoading(true)
      let token = await getToken()
      let { email, name, profile_picture } = await authService.getMe(token)
      setData({ email, name, profile_picture })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const onSignOutPressed = () => {
    Alert.alert("Sign Out", "Apakah anda yakin untuk keluar?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await signOut()
          navigation.replace("Dashboard")
        },
      },
    ])
  }

  let handleUploadPhoto = async (result) => {
    setProfileLoading(true)
    let token = await getToken()
    try {
      let res = await fetch("http://laundry.lpipb.com/api/edit-profile-photo", {
        method: "POST",
        body: createFormData(result),
        headers: {
          "Content-Type": "multipart/form-data; ",
          Authorization: `Bearer ${token}`,
        },
      })
      let responseJson = await res.json()
      if (responseJson) {
        Alert.alert("Berhasil", "Photo profil berhasil diubah!")
      }
      setPhoto(null)
      getData()
      setProfileLoading(false)
    } catch (error) {
      console.error(error)
      setProfileLoading(false)
      setPhoto(null)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    })

    if (!result.cancelled) {
      setPhoto(result)
      setTimeout(async () => {
        await handleUploadPhoto(result)
      }, 3000)
    }
  }

  useEffect(() => {
    if (authData) {
      const willFocusSubscription = navigation.addListener("focus", () => {
        setPhoto(null)
        getData()
      })
      return willFocusSubscription
    }
  }, [])

  if (!authData) {
    return <Unauthenticate navigation={navigation} />
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
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
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          padding: 30,
          backgroundColor: "#f5f5f5",
          alignItems: "center",
        }}
      >
        <ProfilPicture
          image={photo ? photo?.uri : data?.profile_picture}
          pickImage={pickImage}
          loading={profileLoading}
        />
        <Text
          style={{
            marginTop: 15,
            fontSize: 18,
            fontWeight: "bold",
            color: "#3a3b3c",
          }}
        >
          {data?.name}
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#3a3b3c",
          }}
        >
          {data?.email}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("UpdateProfile")}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "gray" }}>
              Edit Profil
            </Text>
            <FontAwesome name="edit" size={18} color="gray" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "gray" }}>Pesanan</Text>
            <FontAwesome name="money" size={18} color="gray" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Address")}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "gray" }}>Alamat</Text>
            <FontAwesome name="building" size={18} color="gray" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSignOutPressed()}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "gray" }}>Keluar</Text>
            <FontAwesome name="sign-out" size={18} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
