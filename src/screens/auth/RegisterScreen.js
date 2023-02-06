import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { Text } from "react-native-paper"
import Background from "../../components/Background"
import Logo from "../../components/Logo"
import Header from "../../components/Header"
import Button from "../../components/Button"
import TextInput from "../../components/TextInput"
import { theme } from "../../core/theme"
import { emailValidator } from "../../helpers/emailValidator"
import { passwordValidator } from "../../helpers/passwordValidator"
import { nameValidator } from "../../helpers/nameValidator"
import { phoneValidator } from "../../helpers/phoneValidator"
import { useAuth } from "../../context/AuthContext"
import ErrorAlert from "../../components/ErrorAlert"
import { CommonActions } from "@react-navigation/native"

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth()

  const [loading, isLoading] = useState(false)
  const [error, setError] = useState(false)

  const [name, setName] = useState({ value: "", error: "" })
  const [email, setEmail] = useState({ value: "", error: "" })
  const [phone, setPhone] = useState({ value: "", error: "" })
  const [password, setPassword] = useState({ value: "", error: "" })

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const phoneError = phoneValidator(phone.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError || phoneError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPhone({ ...phone, error: phoneError })
      setPassword({ ...password, error: passwordError })
      return
    }
    isLoading(true)
    try {
      let response = await register({
        name: name.value,
        email: email.value,
        phone_number: phone.value,
        password: password.value,
      })
      console.info(response)
      if (response) {
        isLoading(false)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Dashboard",
              },
            ],
          }),
        )
      }
    } catch (error) {
      setError(true)
      isLoading(false)
      console.error(error)
    }
  }

  return (
    <Background>
      <Logo />
      <Header>Daftar Akun</Header>

      {error && <ErrorAlert text="Opps! Terdapat kesalahan." />}

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
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Nomor Handphone"
        returnKeyType="done"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text, error: "" })}
        error={!!phone.error}
        errorText={phone.error}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      {loading ? (
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
        <Button
          mode="contained"
          onPress={onSignUpPressed}
          style={{ marginTop: 24 }}
        >
          Daftar
        </Button>
      )}

      <View style={styles.row}>
        <Text>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
})
