import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";


const Stack = createNativeStackNavigator()

export default function HomeStackNavigation({ navigation }: { navigation: any }): JSX.Element {
    return (
      <View style={styles.container}>
        <Text>Movie Page</Text>
        <Button
          title="Pergi ke Movie Detail"
          onPress={() => navigation.navigate('MovieDetail')}
        />
      </View>
    )
  }

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