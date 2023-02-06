import React from "react"
import { StyleSheet, View, SafeAreaView } from "react-native"
import { theme } from "../core/theme"

export default function Background({ children }) {
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    // padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
})
