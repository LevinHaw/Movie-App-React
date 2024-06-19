import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import Favorite from "../screen/Favorite";
import Search from "../screen/Search";
import Home from "../screen/Home";

const Tab = createBottomTabNavigator()

const BottomTabNavigation = (): JSX.Element => (
    <Tab.Navigator>
        <Tab.Screen 
        name = "Home"
        component={Home}
        options = {{
            tabBarIcon: ({color}) => (
                <Feather name="home" size={28} color={color}/>
            ),
            headerShown: false,
        }}
        />
        <Tab.Screen 
        name = "Search"
        component={Search}
        options = {{
            tabBarIcon: ({color}) => (
                <Feather name="search" size={28} color={color}/>
            ),
            headerShown: false,
        }}
        />
        <Tab.Screen 
        name = "Favorite"
        component={Favorite}
        options = {{
            tabBarIcon: ({color}) => (
                <Feather name="heart" size={28} color={color}/>
            ),
            headerShown: false,
        }}
        />
    </Tab.Navigator>
)

export default BottomTabNavigation