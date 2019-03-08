import React from 'react';
import {Platform, ScrollView, StyleSheet, View, RefreshControl} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Location, Permissions,DangerZone} from 'expo';
import {Card, Image, Text} from 'react-native-elements';
import _ from 'lodash';
const { Lottie } = DangerZone;
import animate from '../animation-w72-h72'

export default class LinksScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            errorMessage: '',
            refreshing: false,
            location: null
        }
    }






    getPosts = () => {
        this.setState({refreshing: true});

        fetch('http://54.38.65.73/get?' + 'latitude=' + this.state.location.coords.latitude + ' &longitude=' + this.state.location.coords.longitude, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-App-Version': 11
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    messages: responseJson.messages,
                    errorMessage: responseJson.errorMessage,
                    refreshing: false
                })
            })
    }

    componentWillMount() {

        this.setState({ requestingLocation: true });
        this._getLocationAsync();

    }


    _getLocationAsync = async () => {
        this.setState({ location: 'fetching...' })
        const permission = await Permissions.askAsync(Permissions.LOCATION)
        const providerStatus = await Location.getProviderStatusAsync()
        this.setState({ permission, providerStatus })

        try {
            const timeout = new Promise((resolve, reject) => {
                return setTimeout(() => reject(new Error('Location timeout')), 20 * 1000)
            })

            console.log('location.accuracy', Location.Accuracy)

            const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })

            const location = await Promise.race([locationPromise, timeout])

            this.setState({ location })
            this.getPosts()
        } catch (err) {
            this.setState({ location: err.message })
        }
    }
    //
    // format-align-center
    // format-align-center
    // format-align-left
    // format-align-right
    // format-line-style


    cardElementRender = (elem, i) => {
        return (
            <Card key={i} titleStyle={{fontFamily: 'space-mono'}} containerStyle={{alignItems: 'center'}} title="00291 SAID">

                <View  style={styles.user}>

                    <Text style={styles.name}>{elem.message}</Text>
                </View>

            </Card>
        )
    }



    render() {
        console.log(this.state.messages)

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.getPosts}
                    />}
                style={styles.container}>

                {_.isEmpty(this.state.messages) ?
                    <View>
                    <Text style={{fontFamily: 'space-mono', textAlign: 'center', fontSize: 18, marginTop: 20, marginHorizontal: 20}}>
                       We weren't able to see any messages in your current location   </Text>
                        <Text style={{fontFamily: 'space-mono', fontWeight: 'bold', textAlign: 'center', fontSize: 18, marginTop: 20, marginHorizontal: 20}}>
                            Try posting one!"   </Text>
                    </View>
                    : undefined}
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                {this.state.messages.map((elem, i) =>  this.cardElementRender(elem, i) )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    user: {
        justifyContent: 'center'
    },
    name: {
        textAlign: 'center',
        fontFamily: 'space-mono'
    }
});
