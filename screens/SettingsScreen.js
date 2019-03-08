
import React from 'react';
import {  StyleSheet, View, Dimensions } from 'react-native';
import { DangerZone } from 'expo';
import {Text,Icon, Button} from 'react-native-elements';
const { Lottie } = DangerZone;
import animate from '../animation-w72-h72'
import Colors from "../constants/Colors";

export default class SettingsScreen extends React.Component {
    state = {
        animation: animate,
    };
    static navigationOptions = {
        header: null,
    };



    render() {
        return (


            <View style={styles.animationContainer}>


                <Text style={styles.textStyle}>Life of own server...</Text>
                <Text style={styles.textStyle}>3 years 122 days to die.</Text>
                <Button
                    containerStyle={{alignSelf: 'flex-end', marginVertical: 20}}
                    buttonStyle={{backgroundColor: Colors.secondaryColor, alignSelf: 'flex-end'}}
                    title="Give me life"
                    textStyle={{fontFamily: 'space-mono'}}
                    raised
                />
                <Text style={styles.textStyle}>Every 1$ give 10 days of live</Text>

                <Text style={styles.textStyle}>Please Donate to give life to</Text>
                <Text style={{fontFamily: 'space-mono', fontSize: 36, alignSelf: 'flex-end'}}>memoriae</Text>




            </View>

        );
    }

    _playAnimation = () => {

        this.animation.play();

    };

    _loadAnimationAsync = async () => {
        let result = await fetch(
            'https://cdn.rawgit.com/airbnb/lottie-react-native/635163550b9689529bfffb77e489e4174516f1c0/example/animations/Watermelon.json'
        )
            .then(data => {
                return data.json();
            })
            .catch(error => {
                console.error(error);
            });
        this.setState({ animation: result }, this._playAnimation);
    };
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        marginRight: 20,
        marginVertical: 20
    },
    buttonContainer: {
        paddingTop: 20,
    },
    textStyle: {fontFamily: 'space-mono', fontSize: 18, alignSelf: 'flex-end'}
});
