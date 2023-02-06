import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import TabsNavigation from "./TabsNavigation"
import LaundyDetailScreen from "../screens/app/LaundryDetailScreen"
import AddressInputScreen from "../screens/app/AddressInputScreen"
import AddressScreen from "../screens/app/AddressScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import { AntDesign } from "@expo/vector-icons"
import OrderDetailScreen from "../screens/app/OrderDetailScreen"
import LaundryOrderScreen from "../screens/app/LaundryOrderScreen"
import UpdateProfileScreen from "../screens/app/UpdateProfileScreen"
import AddressUpdateScreen from "../screens/app/AddressUpdateScreen"

const Stack = createStackNavigator()

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={TabsNavigation} />
      <Stack.Screen name="LaundryDetail" component={LaundyDetailScreen} />

      <Stack.Group
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerBackImage: () => (
            <AntDesign
              name="arrowleft"
              size={24}
              style={{ marginLeft: 20 }}
              color="black"
            />
          ),
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="LaundryOrder"
          options={{
            title: "Buat Pesanan",
          }}
          component={LaundryOrderScreen}
        />

        <Stack.Screen
          name="OrderDetail"
          options={{
            title: "Detail Pesanan",
          }}
          component={OrderDetailScreen}
        />

        <Stack.Screen
          name="Address"
          options={{
            title: "Alamat",
          }}
          component={AddressScreen}
        />
        <Stack.Screen
          name="AddressInsert"
          options={{
            title: "Tambah Alamat",
          }}
          component={AddressInputScreen}
        />
        <Stack.Screen
          name="AddressUpdate"
          options={{
            title: "Ubah Alamat",
          }}
          component={AddressUpdateScreen}
        />

        <Stack.Screen
          name="UpdateProfile"
          options={{
            title: "Edit Profil",
          }}
          component={UpdateProfileScreen}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: "modal",
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
