import React, { useState, useEffect, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native"
import LaundryCard from "../../components/LaundryCard"
import { laundryService } from "../../services/laundryService"
import { useLocation } from "../../context/LocationContext"
import category from "../../../constant/categories"
import EmptyList from "../../components/EmptyList"

const renderLoader = (isLoading) => {
  return isLoading ? (
    <View
      style={{
        marginVertical: 16,
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#aaa" />
    </View>
  ) : null
}

export default function HomeScreen({ navigation }) {
  const { location, errorMsg } = useLocation()
  const searchInput = useRef(null)

  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("nearest")
  const [endData, setEndData] = useState(1)

  const getData = ({ filter = "nearest", page = 1, type = "" }) => {
    setIsLoading(true)
    const query = {
      lat: location?.coords.latitude,
      long: location?.coords.longitude,
      page,
      filter,
      search,
    }

    laundryService
      .getLaundry(query)
      .then((response) => {
        if (type == "PAGE") {
          setData([...data, ...response?.data])
        } else {
          setCurrentPage(1)
          setData(response?.data)
        }

        setEndData(response?.last_page)
        setIsLoading(false)
      })
      .catch((error) => console.error(error))
  }

  const changeFilter = (id) => {
    setSelectedCategory(id)
    setData([])
    getData({
      filter: id,
    })
  }

  const loadMoreItem = () => {
    if (currentPage < endData) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (location)
      getData({
        filter: selectedCategory,
        page: currentPage,
        type: "PAGE",
      })
  }, [location, currentPage])

  if (!location) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {!errorMsg && (
          <>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10 }}>Mendeteksi lokasi anda...</Text>
          </>
        )}
        {errorMsg && <Text>{errorMsg}</Text>}
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#fff",
      }}
    >
      <View>
        <TouchableOpacity
          onPress={() => searchInput.current.focus()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            backgroundColor: "#f5f5f5",
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="lightgray"
            style={{
              marginRight: 10,
            }}
          />
          <TextInput
            ref={searchInput}
            placeholder="Cari laundry di sekitarmu.."
            placeholderTextColor="lightgray"
            style={{
              width: "90%",
            }}
            value={search}
            onChangeText={(newText) => setSearch(newText)}
            onSubmitEditing={getData}
          />
        </TouchableOpacity>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", marginVertical: 15 }}>
            {category.map((item, index) => (
              <TouchableOpacity
                onPress={() => changeFilter(item.id)}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 0.5,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 15,
                    marginRight: 10,
                    borderColor:
                      item.id === selectedCategory ? "orange" : "lightgray",
                  }}
                >
                  {item.id === selectedCategory ? item.iconActive : item.icon}
                  <Text
                    style={{
                      color: item.id === selectedCategory ? "orange" : "gray",
                      marginLeft: 5,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          onRefresh={() => {
            getData({
              filter: selectedCategory,
            })
          }}
          refreshing={isLoading}
          data={data}
          renderItem={({ item }) => (
            <LaundryCard
              data={item}
              action={() =>
                navigation.navigate("LaundryDetail", {
                  laundryId: item.id,
                })
              }
            />
          )}
          keyExtractor={(item, index) => String(index)}
          ListFooterComponent={() => renderLoader(isLoading)}
          ListEmptyComponent={<>{!isLoading && <EmptyList />}</>}
          onEndReached={loadMoreItem}
          onEndReachedThreshold={0}
        />
      </View>
    </View>
  )
}
