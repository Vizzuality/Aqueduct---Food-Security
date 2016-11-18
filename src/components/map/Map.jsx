/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */

import React from 'react';
import L from 'leaflet';

class Map extends React.Component {

  componentDidMount() {
    this.map = L.map('map', {
      minZoom: 2,
      zoom: 3,
      center: [52, 7],
      detectRetina: true
    });

    this.map.attributionControl.addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>');
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png')
                      .addTo(this.map)
                      .setZIndex(0);
    // Listen to leaflet events
    this.addMapEventListeners();
  }

  componentWillUnmount() {
    this.map.off('zoomend');
    this.map.off('dragend');
    this.map.remove();
  }

  getLatLng() {
    const latLng = this.map.getCenter();
    latLng.lat = latLng.lat.toFixed(2);
    latLng.lng = latLng.lng.toFixed(2);

    return latLng;
  }

  getMapParams() {
    const latLng = this.getLatLng();
    const params = {
      zoom: this.map.getZoom()
    };

    if (latLng) {
      params.latLng = latLng;
    }
    return params;
  }

  addMapEventListeners() {
    function mapChangeHandler() {
      this.props.setMapParams(this.getMapParams());
    }
    this.map.on('zoomend', mapChangeHandler.bind(this));
    this.map.on('dragend', mapChangeHandler.bind(this));
  }

  render() {
    return (
      <div className="l-map -fullscreen">
        <div id={'map'} className="c-map" />
      </div>
    );
  }
}

Map.propTypes = {
  setMapParams: React.PropTypes.func
};

export default Map;
