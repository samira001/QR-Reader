import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DbConnector } from './../connectors/DatabaseConnector';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dbName.db');

function componentDidMount() {
//    alert(db);
   db.transaction(tx => {
         tx.executeSql(
           "create table if not exists items (id integer primary key not null, done int, value text);"
         );
       });
}

function insertDataToTable(data){
    const name = data;
    db.transaction(
         tx => {
           tx.executeSql("insert into items (done, value) values (0, ?)", [name]);
           tx.executeSql("select * from items", [], (_, { rows }) =>
             console.log(JSON.stringify(rows))
           );
         },
       );
     }

function saveData(data){
//    console.log(data);
    insertDataToTable(data);
}


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    saveData(`${data}`);
    alert(`${data}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}