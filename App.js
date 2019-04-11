import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './src/reducers';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { Localization } from 'expo';
import i18n from 'i18n-js';
import {en, it, es, de} from './assets/i18n/localization';


store = createStore(rootReducer, applyMiddleware(thunk));

i18n.fallbacks = true;
i18n.translations = { it, en, es, de };
i18n.locale = Localization.locale;


export default class App extends React.Component {

    state = {
        isLoadingComplete: false,
        location: null,
        errorMessage: null,
        requestingLocation: true,
    };


    getRandomInt = (max) =>  {
        return Math.floor(Math.random() * Math.floor(max));
    };


    componentWillMount() {
        this.setState({user: this.getRandomInt(10000)})
    };


    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
                    <Provider store={store}>

                    <AppNavigator screenProps={this.state} />
                    </Provider>

                </View>
            );
        }
    }


    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/robot-dev.png'),
                require('./assets/images/robot-prod.png'),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app

                'space-mono': require('./assets/fonts/RobotoMono-Light.ttf'),
                'noto-sans-bold': require('./assets/fonts/AvenirNext-Bold.ttf'),
                'noto-sans-light': require('./assets/fonts/AvenirNext-UltraLight.ttf'),
                'noto-sans-reg': require('./assets/fonts/AvenirNext-Regular.ttf'),
                'merry-reg': require('./assets/fonts/AvenirNext-Regular.ttf'),


            }),
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
