import { AntDesign } from "@expo/vector-icons"
import React, { useEffect, useState } from "react"
import { View, Text, Alert, ActivityIndicator, ScrollView } from "react-native"
import { Button, TextInput } from "react-native-paper"
import StarReview from "react-native-stars"
import { useAuth } from "../../context/AuthContext"
import { currencyFormat } from "../../helpers/currencyFormat"
import { orderService } from "../../services/orderService"

const TableRow = ({ field }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 20 }}>
      {field.map((item, index) => (
        <View key={index} style={{ flex: 1 }}>
          <Text style={{ fontWeight: index > 0 ? "bold" : "300" }}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

export default function OrderDetailScreen({ navigation, route }) {
  const ID = route.params.orderId
  const { getToken } = useAuth()
  const [data, setData] = useState()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    try {
      setLoading(true)
      let token = await getToken()
      let response = await orderService.getOrderById(token, ID)
      setData(response)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const cancelOrder = async () => {
    Alert.alert(
      "Batalkan pesanan?",
      "silahkan konfirmasi pembatalan pesanan anda",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              let token = await getToken()
              let response = await orderService.cancelOrder(
                token,
                ID,
                "DIBATALKAN",
              )
              if (response) {
                Alert.alert("Order berhasil dibatalkan!")
                getData()
              }
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    )
  }

  const handleUlasan = async () => {
    if (rating === 0) {
      Alert.alert("Ulasan tidak boleh kosong!")
      return
    }

    Alert.alert("Submit Ulasan?", "konfirmasi ulasan anda", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            let token = await getToken()
            let response = await orderService.submitUlasan(
              token,
              ID,
              rating,
              comment,
            )
            if (response) {
              Alert.alert("Terima kasih!", "Ulasan berhasil disubmit!")
              getData()
            }
          } catch (error) {
            console.error(error)
          }
        },
      },
    ])
  }

  useEffect(() => {
    getData()
  }, [])

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
        paddingHorizontal: 20,
      }}
    >
      <ScrollView>
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingTop: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <TableRow field={["Status", data?.status]} />
          <TableRow field={["Laundry", data?.laundry]} />
          <TableRow field={["Tanggal", data?.date]} />
          <TableRow field={["Berat", `${data?.weight} KG`]} />
          <TableRow field={["Harga", currencyFormat(data?.price ?? 0)]} />
          <TableRow
            field={[
              "Sudah dibayar",
              parseInt(data?.is_paid) ? "Sudah" : "Belum",
            ]}
          />
          <TableRow
            field={[
              "Sudah diambil",
              parseInt(data?.is_pickedup) ? "Sudah" : "Belum",
            ]}
          />
          <TableRow
            field={[
              "Antar/Jemput",
              parseInt(data?.with_pick_up) ? "Ya" : "Tidak",
            ]}
          />
          {data?.address && <TableRow field={["Alamat", data?.address]} />}
        </View>

        {data?.status === "SELESAI" && (
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              marginVertical: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Ulasan</Text>
              <View style={{ alignItems: "flex-end" }}>
                <StarReview
                  default={parseInt(data?.review?.rating ?? 0)}
                  count={5}
                  half={false}
                  update={(value) => setRating(value)}
                  fullStar={<AntDesign name="star" size={25} color="orange" />}
                  emptyStar={<AntDesign name="staro" size={25} color="grey" />}
                />
              </View>
            </View>
            <TextInput
              mode="outlined"
              placeholder="masukan ulasan anda!"
              style={{
                backgroundColor: "white",
                marginVertical: 20,
              }}
              defaultValue={data?.review?.comments}
              onChangeText={(text) => setComment(text)}
            />
            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={handleUlasan}
            >
              {data?.review !== null ? "EDIT ULASAN" : "SUBMIT ULASAN"}
            </Button>
          </View>
        )}

        {data?.status === "PESANAN_DIBUAT" && (
          <Button
            style={{ marginTop: 20 }}
            mode="contained"
            color="red"
            icon="cancel"
            onPress={cancelOrder}
          >
            Batalkan
          </Button>
        )}
      </ScrollView>
    </View>
  )
}
