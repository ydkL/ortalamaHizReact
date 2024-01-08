import React, { useState, useEffect } from 'react';
import { Platform, Button, Text, View, StyleSheet } from 'react-native';

import haversine from 'haversine-distance'

import * as Location from 'expo-location';
import speedModel from './model';

import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [maxSpeed, setMaxSpeed] = useState("0")
  const [distanceTravelled, setDisatanceTravelled] = useState("0")
  const [remainingDistance, setRemainingDistance] = useState("0")
  const [distance, setDistance] = useState(100000)
  const [speedLimit, setSpeedLimit] = useState(110)
  const [startDate, setStartDate] = useState(null)
  const [finishDate, setFinishDate] = useState(null)
  const [lastLat, setLastLat] = useState(null)
  const [lastLong, setLastLong] = useState(null)
  var distancedistance = 0.0
  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      _ = await Location.watchPositionAsync(
        { accuracy: 6, timeInterval: 500, distanceInterval: 0  },
        (loc) => {
          setLocation(loc)
        }

      );
      
     
    })();
  }, []);

 

  useEffect (() => {
      var val = parseInt(location?.coords?.speed) * 3600 / 1000
      if (val)
        setCurrentSpeed(val)

      if (lastLat !== 0.0 && lastLong !== 0.0){
        const distanceTemp = getDistanceFromLatLonInKm((location?.coords?.latitude), (location?.coords?.longitude), lastLat, lastLong) ?? 0.0
        distancedistance =  parseFloat(distanceTravelled)
        let a = distancedistance + distanceTemp
        if (a){
          setDisatanceTravelled(a.toString())
          calculateMaxSpeed()
          setRemainingDistance((distance - a).toString())
        }
          
      }
      setLastLat((location?.coords?.latitude))
      setLastLong((location?.coords?.longitude))

  },[location])

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

const calculateMaxSpeed = () => {
let tsDiff = Date.parse(finishDate) - Date.parse(startDate)
let tsDiffasHour = parseFloat(tsDiff) / 1000.0 / 3600.0

  let distanceVal = parseFloat(distance)
  let remainingDistanceVal = distanceVal - parseFloat(distanceTravelled)

  let maxSpeed = remainingDistanceVal / tsDiffasHour / 1000
  setMaxSpeed(maxSpeed.toString())


}

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371000; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
 
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  const handlePress = () => {
    const currentTs = Date.now()
    const finishTs = currentTs + ((parseFloat(distance) / 1000.0 / parseFloat(speedLimit)) * 3600.0 * 1000.0)
    setDisatanceTravelled("0.0")
    setRemainingDistance("0.0")
    setStartDate(new Date(currentTs))
    setFinishDate(new Date(parseInt(finishTs)))
  }

  return (


    <View style={styles.container}>
      <Text>{`Kalan Yol : ${remainingDistance.toString()}`}</Text>
      <Text>{`Maksimum Hız : ${maxSpeed.toString()}`}</Text>
      <Text>{`Gidilen Yol : ${distanceTravelled.toString()}`}</Text>
      <Text>{`Başlangıç Zamanı: ${startDate?.toLocaleString()}`}</Text>
      <Text>{`Çıkış Zamanı: ${finishDate?.toLocaleString()}`}</Text>
      <Speedometer
        value={currentSpeed}
        fontFamily='squada-one'
      >
        <Background />
        <Arc />
        <Needle />
        <Progress />
        <Marks />
        <Indicator />
      </Speedometer>
      {/* <Text style={styles.paragraph}>{text}</Text> */}
      <Button title='Start' variant="outlined" onPress={handlePress} ></Button>

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});