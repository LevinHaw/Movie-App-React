import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";

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
        const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzk4OTQxMWEzOGYxYmYxZTkzYTg3NjFiMTYwMjY2MSIsInN1YiI6IjY2NzQxMmE5ODI0ODYxN2E3MDRlYjcyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kKFJPVnse8TIpQ2FesQ5NWfoIvihqWr4QRYOh3MyCnU"

        const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"

        const options = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        }

        fetch(url, options)
        .then(async(response) => await response.json())
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