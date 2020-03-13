import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dbName');


export default class DatabaseConnector extends React.Component{

    componentDidMount() {
        db.transaction(tx => {
          tx.executeSql(
            "create table if not exists QR-Data (id integer primary key not null, Name text);"
          );
        });
      }
}