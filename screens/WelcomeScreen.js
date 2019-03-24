import React from 'react';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, I18nManager, AsyncStorage } from 'react-native';
import { LinearGradient,  } from 'expo';
import AppIntroSlider from '../components/AppIntroSlider';
import {Image, CheckBox, Button} from 'react-native-elements';
import Colors from "../constants/Colors";
import { AppLoading } from 'expo';
import _ from 'lodash'
import i18n from 'i18n-js';

I18nManager.forceRTL(false);


const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: 320,
        height: 320,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        fontSize: 18,
        fontFamily: 'merry-reg'


    },
    title: {
        fontSize: 26,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'noto-sans-bold'
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
//'Text the World!',
//'People can read your messages just in your position, try using #hashtag to see your message next time!',
const slides = [
    {
        key: 'somethun',
        title: 'title_1_splash',
        text: 'text_1_splash',
        icon: 'comment-text-multiple',
        colors: ['#009485', '#40B1A5'],
    },
    {
        key: 'somethun1',
        title: 'title_2_splash', // 'Completely Anonymous',
        text: 'text_2_splash',
            //'Your message are entirely anonymous, you should not use any name or personal information of others.',
        icon: 'eye-off',
        colors: ['#009485', '#40B1A5'],
    },
    {
        key: 'somethun2',
        title: '',
        text: '',
        icon: false,
        colors: ['#009485', '#40B1A5'],
        image: true
    },
];

export default class WelcomeScreen extends React.Component {

    async componentWillMount() {
        let token = await AsyncStorage.getItem('token');

        if (token) {
            this.props.navigation.navigate('Main');
            this.setState({ token });
        } else {
            this.setState({ token: false });
        }
    }




    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    static navigationOptions = {
        header: null,
    };

    _renderItem = (props, that) => {
        console.log("mamalo",props)

        return (
            <LinearGradient
                style={[
                    styles.mainContent,
                    {
                        paddingTop: props.topSpacer,
                        paddingBottom: props.bottomSpacer,
                        width: props.width,
                        height: props.height,
                    },
                ]}
                colors={props.colors}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.1, y: 1 }}
            >
                {props.icon ? <MaterialCommunityIcons
                    style={{ backgroundColor: 'transparent' }}
                    name={props.icon}
                    size={200}
                    color="white"
                /> : undefined}

                {props.image ?
                    <React.Fragment >
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={{ width: 160, height: 175 }}
                        />

                        <View style={styles.termsContainer}>
                            <CheckBox
                                containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                                title={i18n.t('terms')} //"You accept the terms and condition"
                                checked={that.state.checked}
                                textStyle={{color:'black', fontFamily: 'merry-reg', letterSpacing: 1.1}}
                                checkedColor='black'
                                onPress={() => that.setState({ checked: !that.state.checked })}
                            />
                            <CheckBox
                                containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                                title={i18n.t('privacy')}//"You confirm you have read the privacy policy"
                                checked={that.state.policyChecked}
                                textStyle={{color:'black', fontFamily: 'merry-reg', letterSpacing: 1.1}}
                                checkedColor='black'
                                onPress={() => that.setState({ policyChecked: !that.state.policyChecked })}
                            />
                        </View>

                    </React.Fragment>

                    : undefined}

                <View>
                    <Text style={styles.title}>{i18n.t(props.title)}</Text>
                    <Text style={styles.text}>{i18n.t(props.text)}</Text>
                </View>
            </LinearGradient>
        )};


    onDone = async () => {
        await AsyncStorage.setItem('token', '1');

            this.props.navigation.navigate('Main');

    }

    render() {

        if (_.isNull(this.state.token)) {
            return <AppLoading />;
        }


        return (
            <AppIntroSlider
                slides={slides}
                renderItem={this._renderItem}
                extraData={this}
                bottomButton
                onDone={this.onDone}

                // hideNextButton
                // hideDoneButton
                // onSkip={() => console.log("skipped")}
            />
        );
    }
}