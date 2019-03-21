import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import WelcomeScreen from '../screens/WelcomeScreen'

import Colors from '../constants/Colors'

export default createAppContainer(createStackNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Welcome: {screen: WelcomeScreen},
        Main: {
            screen: MainTabNavigator,
            navigationOptions: () => ({
                title: `memoriae`,
                headerBackTitle: null,
                headerLeft: null,
                gesturesEnabled: false,
                header: null,

            }),
        }

    },{
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: Colors.tintColor,

            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontFamily: 'noto-sans-bold',
                fontSize: 26,
                alignSelf: 'center',
                justifyContent: 'center',
                textAlign:"center",
                flex:1
            }
        }
    }
));