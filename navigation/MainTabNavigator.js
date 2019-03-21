import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator,  createMaterialTopTabNavigator, MaterialTopTabBar, createBottomTabNavigator, BottomTabBar } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import LocationScreen from '../screens/LocationScreen';
import Colors from '../constants/Colors'
const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'YOU',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: '#00FFE5',
        inactiveTintColor: 'white',
        indicatorStyle: {
            backgroundColor: '#00FFE5',
        },
        style: {
            backgroundColor: Colors.tintColor
        },
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'filetext1'}
            type={'antdesign'}
        />
    ),
};

const LinksStack = createStackNavigator({
    Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarLabel: 'OTHER',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: '#00FFE5',
        inactiveTintColor: 'white',
        indicatorStyle: {
            backgroundColor: '#00FFE5',
        },

        style: {
            backgroundColor: Colors.tintColor
        },
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            type={'antdesign'}
            name={ 'copy1' }
        />
    ),
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarLabel: 'US',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: '#00FFE5',
        inactiveTintColor: 'white',
        indicatorStyle: {
            backgroundColor: '#00FFE5',
        },


        style: {
            backgroundColor: Colors.tintColor
        },
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            type={'antdesign'}
            name={'database'}
        />
    ),
};


export default createBottomTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack,
});
