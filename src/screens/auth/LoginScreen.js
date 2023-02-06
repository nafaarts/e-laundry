import React, { useState } from "react"
import {
  TouchableOpacity,
  StyleSheet,
  View,
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
import ErrorAlert from "../../components/ErrorAlert"
import { useAuth } from "../../context/AuthContext"
import { CommonActions } from "@react-navigation/native"

export default function LoginScreen({ navigation }) {
  const [loading, isLoading] = useState(false)
  const [error, setError] = useState(false)
  const [email, setEmail] = useState({ value: "", error: "" })
  const [password, setPassword] = useState({ value: "", error: "" })

  const { signIn } = useAuth()

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    isLoading(true)
    try {
      await signIn({ email: email.value, password: password.value })
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
    } catch (error) {
      setError(true)
      isLoading(false)
    }
  }

  return (
    <Background>
      <Logo />
      <Header>Selamat Datang</Header>

      {error && <ErrorAlert text="Opps! akun tidak ditemukan" />}

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
        <Button mode="contained" onPress={onLoginPressed}>
          Masuk
        </Button>
      )}

      <View style={styles.row}>
        <Text>Belum punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
})
