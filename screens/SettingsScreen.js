
import React from 'react';
import {  StyleSheet, View, Dimensions } from 'react-native';
import { DangerZone } from 'expo';
import {Text,Icon, Button} from 'react-native-elements';
const { Lottie } = DangerZone;
import animate from '../animation-w72-h72'
import Colors from "../constants/Colors";
import {connect} from "react-redux";
import {addSearchHashtag, deleteMessage, getMessages, refreshing, reportMessage} from "../src/actions/messagesActions";
import moment from 'moment';
import i18n from 'i18n-js';

class SettingsScreen extends React.Component {
    state = {
        animation: animate,
    };
    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor,

        },
        title: `memoriae`,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'noto-sans-bold',
            fontSize: 26,
            alignSelf: 'center',
            justifyContent: 'center',
            textAlign:"center",
            flex:1
        },
    };

    secondsToHms = () => {
        2131111
        let d = Number(this.props.lifetime);
        let y, m, dd, h;

        let str = '';

        if(d>3600 * 24 * 30 * 12) {
            y = Math.floor(d / (3600 * 24 * 30 * 12));
            d = d % 3600 * 24 * 30 * 12;
            str += y + " years "
        }

        if(d>3600 * 24 * 30 ){
            m = Math.floor(d / (3600 * 24 * 30));
            d = d % 3600 * 24 * 30 ;
            str += m + " months "

        }

        if(d>3600 * 24) {
            dd = Math.floor(d / (3600 * 24));
            d = d % 3600 * 24  ;
            str += dd + " days "

        }

        if(d>3600 ) {
            h = Math.floor(d / 3600 );
            str += h + " hours "

        }
        return str
    }
//Life of own server...

    //to die
    //"Give me life"

    // Every {this.props.hourRate}$ give 1 hour of live
    render() {


        console.log("puttanina", this.props.lifetime);
        return (
            <React.Fragment>
            <View style={{backgroundColor: Colors.secondaryColor, height: 10}} />
            <View style={styles.animationContainer}>


                <Text style={styles.textStyle}>{i18n.t('us_screen_text')}</Text>
                <Text style={styles.textStyle}>
                    {this.secondsToHms()}
                    {i18n.t('to_die')}</Text>
                <Button
                    containerStyle={{alignSelf: 'flex-end', marginVertical: 20}}
                    buttonStyle={{backgroundColor: Colors.secondaryColor, alignSelf: 'flex-end'}}
                    title= {i18n.t('give_me_live')}
                    raised
                />
                <Text style={styles.textStyle}>{i18n.t('hour_rate', { hourRate: this.props.hourRate })} </Text>

                <Text style={styles.textStyle}>{i18n.t('donate')}</Text>
                <Text style={{fontFamily: 'noto-sans-bold', fontSize: 36, alignSelf: 'flex-end'}}>{i18n.t('memoriae')}</Text>

            </View>
            </React.Fragment>

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


const mapStateToProps = state => ({
    hourRate: state.Message.hourRate,
    lifetime: state.Message.lifetime,
});


const mapDispatchToProps = dispatch =>({
    refreshing: () => dispatch(refreshing()),

});

export default connect(mapStateToProps, mapDispatchToProps())(SettingsScreen)

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
    textStyle: {
        fontFamily: 'noto-sans-reg',
        letterSpacing: 1.1,
        fontSize: 18,
        alignSelf: 'flex-end'
    }
});
