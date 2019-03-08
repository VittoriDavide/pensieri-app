import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createStackNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: {
            screen: MainTabNavigator,
            navigationOptions: () => ({
                title: `memoriae`,
                headerBackTitle: null,


            }),
        }

    },{
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#293133',

            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontFamily: 'space-mono',
                fontSize: 26

            }
        }
    }
));