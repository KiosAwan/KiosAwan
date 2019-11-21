import React, { Component } from "react";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isMapReady: false,
      region: { ...this.props.region }
    };
  }
  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };
  render() {
    return (
      <MapView
        onPress={this.props.onMapsPress}
        style={{ height: this.props.height }}
        provider={"google"}
        mapType="standard"
        showsScale
        showsCompass
        showsBuildings
        showsPointsOfInterest
        onLayout={this.onMapLayout}
        region={{
          ...this.props.region,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
      >
          <MapView.Marker
            title="Lokasi Toko Anda"
            coordinate={this.props.region}
            draggable={this.props.draggable ? true : false}
            onDragEnd={e => this.props.changeRegion(e.nativeEvent)}
          />
      </MapView>
    );
  }
}

export default Maps;