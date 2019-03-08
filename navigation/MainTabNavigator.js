import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation';

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
        activeTintColor: Colors.tintColor,
        inactiveTintColor: Colors.tintColor + "AA",

        style: {
          backgroundColor: 'white'
        },
        indicatorStyle: { backgroundColor: Colors.tintColor, }
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'format-align-left'}
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
        indicatorStyle: {
          color: Colors.tintColor,
        },
        activeTintColor: Colors.tintColor,
        inactiveTintColor: Colors.tintColor + "AA",

        style: {
            backgroundColor: 'white'
        },
        indicatorStyle: { backgroundColor: Colors.tintColor, }
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            type={'material-community'}
            name={ 'format-align-center' }
        />
    ),
};
const LocationStack = createStackNavigator({
    Location: LocationScreen,
});

LocationScreen.navigationOptions = {
    tabBarLabel: 'Location',
    tabBarOptions: {
        showIcon: true,
        indicatorStyle: {
            color: Colors.tintColor,
        },
        activeTintColor: Colors.tintColor,
        inactiveTintColor: Colors.tintColor + "AA",

        style: {
            backgroundColor: 'white'
        },
        indicatorStyle: { backgroundColor: Colors.tintColor, }
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            type={'material-community'}
            name={ 'format-align-center' }
        />
    ),
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarLabel: 'OWN',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: Colors.tintColor,
        inactiveTintColor: Colors.tintColor + "AA",


        style: {
            backgroundColor: 'white'
        },
        indicatorStyle: { backgroundColor: Colors.tintColor, }
    },
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            type={'material-community'}
            name={'format-align-right'}
        />
    ),
};

export default createMaterialTopTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack,
},{
    tabBarComponent: props => {
        const backgroundColor = props.position.interpolate({
            inputRange: [0,1,2],
            outputRange: ['#fff','#fff','#fff'],
        })
        return (
            <MaterialTopTabBar
                {...props}
                style={{ backgroundColor, borderBottomColor: 'grey' }}
            />
        );
    },tabBarOptions: { indicatorStyle: { backgroundColor: 'transparent', } }
});
