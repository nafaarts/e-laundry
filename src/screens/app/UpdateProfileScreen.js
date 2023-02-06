import React, { useState, useEffect } from "react"
import { Text, View, ActivityIndicator, Alert } from "react-native"
import Background from "../../components/Background"
import Button from "../../components/Button"
import TextInput from "../../components/TextInput"
import Unauthenticate from "../../components/Unauthenticate"
import { useAuth } from "../../context/AuthContext"
import { emailValidator } from "../../helpers/emailValidator"
import { passwordValidator } from "../../helpers/passwordValidator"
import { nameValidator } from "../../helpers/nameValidator"
import { phoneValidator } from "../../helpers/phoneValidator"
import { authService } from "../../services/authService"
import { axios } from "../../api/axios.config"
import { theme } from "../../core/theme"

export default function UpdateProfileScreen({ navigation }) {
  const { authData, getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [name, setName] = useState({ value: "", error: "" })
  const [email, setEmail] = useState({ value: "", error: "" })
  const [phone, setPhone] = useState({ value: "", error: "" })
  const [password, setPassword] = useState({ value: "", error: "" })
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  })

  const getData = async () => {
    try {
      setLoading(true)
      let token = await getToken()
      let { email, name, phone_number } = await authService.getMe(token)
      setName({ value: name })
      setEmail({ value: email })
      setPhone({ value: phone_number })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    const nameError = nameValidator(name.value)
    const phoneError = phoneValidator(phone.value)
    const emailError = emailValidator(email.value)

    if (emailError || nameError || phoneError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPhone({ ...phone, error: phoneError })
      return
    }

    let data = {
      name: name.value,
      email: email.value,
      phone_number: phone.value,
    }

    if (password.value) {
      const passwordError = passwordValidator(password.value)
      if (passwordError) {
        setPassword({ ...password, error: passwordError })
        return
      }

      if (!confirmPassword.value) {
        setConfirmPassword({
          ...confirmPassword,
          error: "Mohon ulangi password!",
        })
        return
      }

      if (password.value !== confirmPassword.value) {
        setConfirmPassword({
          ...confirmPassword,
          error: "Password tidak sama!",
        })
        return
      }

      data = { ...data, password: password.value }
    }

    setUpdateLoading(true)
    try {
      let token = await getToken()
      let response = await axios.post("/edit-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response) {
        Alert.alert("Berhasil", "Profil berhasil diubah!")
        setUpdateLoading(false)
        navigation.replace("Dashboard", { screen: "Profile" })
      }
    } catch (error) {
      console.error(error)
      setUpdateLoading(false)
    }
  }

  useEffect(() => {
    if (authData) {
      const willFocusSubscription = navigation.addListener("focus", getData)
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
    <Background>
      <View
        style={{
          flex: 1,
          width: "100%",
          paddingTop: 20,
        }}
      >
        <TextInput
          label="Nama"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: "" })}
          error={!!name.error}
          errorText={name.error}
        />
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
        />
        <TextInput
          label="Nomor Telepn"
          returnKeyType="next"
          value={phone.value}
          onChangeText={(text) => setPhone({ value: text, error: "" })}
          error={!!phone.error}
          errorText={phone.error}
        />
        <TextInput
          label="Password"
          returnKeyType="next"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <TextInput
          label="Ulangi Password"
          returnKeyType="next"
          value={confirmPassword.value}
          onChangeText={(text) =>
            setConfirmPassword({ value: text, error: "" })
          }
          error={!!confirmPassword.error}
          errorText={confirmPassword.error}
          secureTextEntry
        />
        <Text style={{ fontSize: 12, color: "gray", marginBottom: 10 }}>
          *Kosongkan password jika tidak ingin mengganti password.
        </Text>

        {updateLoading ? (
          <View
            style={{
              backgroundColor: theme.colors.primary,
              marginVertical: 10,
              padding: 14.5,
              width: "100%",
              borderRadius: 5,
            }}
          >
            <ActivityIndicator color={"#fff"} animating={true} size="small" />
          </View>
        ) : (
          <Button mode="contained" onPress={onSubmit}>
            Ubah data
          </Button>
        )}
      </View>
    </Background>
  )
}
