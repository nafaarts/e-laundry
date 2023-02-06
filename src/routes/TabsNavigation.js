import { SimpleLineIcons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/app/HomeScreen"
import MapsScreen from "../screens/app/MapsScreen"
import OrderScreen from "../screens/app/OrderScreen"
import ProfileScreen from "../screens/app/ProfileScreen"

const Tab = createBottomTabNavigator()

export default function TabsNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "E-Laundry",
          tabBarIcon: (props) => (
            <SimpleLineIcons {...props} name="home" size={24} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Maps"
        options={{
          tabBarIcon: (props) => (
            <SimpleLineIcons {...props} name="map" size={24} />
          ),
        }}
        component={MapsScreen}
      />
      <Tab.Screen
        name="Orders"
        options={{
          title: "Pesanan",

          tabBarIcon: (props) => (
            <SimpleLineIcons {...props} name="refresh" size={24} />
          ),
        }}
        component={OrderScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{
          title: "Profil",
          tabBarIcon: (props) => (
            <SimpleLineIcons {...props} name="user" size={24} />
          ),
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  )
}
