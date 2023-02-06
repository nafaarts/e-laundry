import React, { useState } from "react"
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"

export default function ProfilPicture({ image, pickImage, loading }) {
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <View
        style={{
          height: 100,
          width: 100,
          backgroundColor: "white",
          borderRadius: 50,
          alignSelf: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={{
              uri: image,
            }}
            style={{
              height: 100,
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          height: 25,
          width: 25,
          borderRadius: 10,
          backgroundColor: "lightgray",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome5 name="camera" size={15} />
      </TouchableOpacity>
    </View>
  )
}
