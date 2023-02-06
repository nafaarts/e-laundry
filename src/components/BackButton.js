import React from "react"
import { TouchableOpacity, Image, StyleSheet } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"
import { AntDesign } from "@expo/vector-icons"

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
})
