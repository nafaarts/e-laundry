import React, { useState, useRef } from "react"
import WebView from "react-native-webview"

export default function MapsScreen({ navigation }) {
  const webViewRef = useRef()
  const [webviewChange, setWebViewChange] = useState({
    key: 1,
    isWebViewUrlChanged: false,
  })

  const resetToInitialUri = () => {
    if (webviewChange.isWebViewUrlChanged) {
      setWebViewChange({
        key: webviewChange.key + 1,
        isWebViewUrlChanged: false,
      })
    }
  }

  const _onNavigationStateChange = (webViewState) => {
    const URL = webViewState.url
    if (URL !== "https://laundry.lpipb.com/explore") {
      let id = URL.split("?id=")[1]
      setWebViewChange({ isWebViewUrlChanged: true })
      resetToInitialUri()
      navigation.push("LaundryDetail", { laundryId: id })
    }
  }

  return (
    <WebView
      key={webviewChange.key}
      ref={(ref) => (webViewRef.current = ref)}
      source={{ uri: "https://laundry.lpipb.com/explore" }}
      geolocationEnabled={true}
      onNavigationStateChange={_onNavigationStateChange.bind(this)}
      style={{
        position: "relative",
      }}
    />
  )
}
