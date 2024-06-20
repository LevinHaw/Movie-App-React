import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import {API_URL, API_ACCESS_TOKEN} from '@env'

export default function MovieDetail({ navigation }: { navigation: any }): JSX.Element {
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      marginVertical20: {
        marginVertical: 20,
      },
    })

    const fetchData = (): void => {

        if (API_URL == null || API_ACCESS_TOKEN.length == null) {
            throw new Error('ENV not found')
          }

        const options = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }

        fetch(API_URL, options)
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
        })
        .catch((err) => {
            console.log(err)
        })
    }
  
    return (
      <View style={styles.container}>
        <Text>Movie Detail Page</Text>
        <Button
          title="Fetch data"
          onPress={() => {
            fetchData()
          }}
        />
      </View>
    )
  }