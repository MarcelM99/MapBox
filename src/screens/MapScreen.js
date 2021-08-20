import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import { lineString as makeLineString } from '@turf/helpers'
import MapboxGL from '@react-native-mapbox-gl/maps';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
MapboxGL.setAccessToken(
  'sk.eyJ1IjoibGVtb245OSIsImEiOiJja3Npc3kxZXowNmw5Mndxb2R3d3hscnRqIn0.1d17TBCDrZsJ2rguMqAcqw',
);
MapboxGL.setConnected(true);
const accessToken='sk.eyJ1IjoibGVtb245OSIsImEiOiJja3NrNWZqdGcwYmM1MnludTY5cnBvZ2RnIn0.Kb6fmyEwr4Xif7ikI8POTA';
const client = MapboxDirectionsFactory({accessToken});

const startCoords={ longitude:27.591423,latitude: 46.770439}
  

const MapScreen = () => {
  const [coord,setCoord] = useState({
    longitude:0,
    latitude:0,
    finalLongitude:0,
    finalLatitude:0,
    route:null,
    secondRoute:null
  })
  useEffect(async () => {
    //const persmission = await MapboxGL.requestAndroidLocationPermissions();
    setCoord({longitude:23.501221,latitude:46.750377,finalLongitude:startCoords.longitude,finalLatitude:startCoords.latitude});
    getRoute([23.501221, 46.750377],[startCoords.longitude,startCoords.latitude])
},[])
  useEffect(() => {
    MapboxGL.locationManager.start();
  }, []);

  const getRoute = async (startLoc,destLoc) => {
    const reqOptions = {
      waypoints: [
        {coordinates:startLoc},
        {coordinates:destLoc}
      ],
      alternatives:true,
      profile:'driving',
      geometries:'geojson',
     
    };
   const res = await client.getDirections(reqOptions).send();
   const route=makeLineString(res.body.routes[0].geometry.coordinates)
   const secoundRoute = res.body.routes[1]!=undefined? makeLineString(res.body.routes[1].geometry.coordinates):null;
   console.log(res.body.routes[1])
   setCoord(prevState => ({...prevState,route:route,secondRoute:secoundRoute}))
   
  }
 const  renderRoad = () => {
    return  (<View>
      <MapboxGL.ShapeSource id='routeSource' shape={coord.route.geometry}>
        <MapboxGL.LineLayer id='routeFill' style={{lineColor: "#ff8109", lineWidth: 3.2, lineCap: MapboxGL.LineJoin.Round, lineOpacity: 1.84}}/>
      </MapboxGL.ShapeSource>
     { coord.secondRoute? <MapboxGL.ShapeSource id='routeSource2' shape={coord.secondRoute.geometry}>
        <MapboxGL.LineLayer id='routeFill2' style={{lineColor: "blue", lineWidth: 3.2, lineCap: MapboxGL.LineJoin.Round, lineOpacity: 1.84}}/>
      </MapboxGL.ShapeSource> : null}
      </View>
    )
  }
  return (
    <View style={{height: '100%', width: '100%'}}>
      <MapboxGL.MapView style={{flex: 1}}>
        <MapboxGL.PointAnnotation
          id='startCoord'
          coordinate={[	27.591423, 46.770439]}
        />
       <MapboxGL.PointAnnotation
          id='endCoord'
          coordinate={[23.501221, 46.750377]}
        />
     {coord.route? renderRoad():null}
        <MapboxGL.UserLocation visible={true} androidRenderMode="compass" />
      </MapboxGL.MapView>
    </View>
  );
};

export default MapScreen;
