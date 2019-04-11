import React from 'react';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {StyleSheet, View, Text, I18nManager, AsyncStorage, TouchableOpacity, Linking} from 'react-native';
import { LinearGradient, Localization } from 'expo';
import AppIntroSlider from '../components/AppIntroSlider';
import {Image, CheckBox, Button} from 'react-native-elements';
import Colors from "../constants/Colors";
import { AppLoading, DangerZone} from 'expo';
import _ from 'lodash'
import i18n from 'i18n-js';
const { Lottie } = DangerZone;
import messages from '../assets/animations/animation-w300-h300'
import lock from '../assets/animations/291-searchask-loop'
import world from '../assets/animations/animation-w1440-h1024'

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
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent'
    },
});
//'Text the World!',
//'People can read your messages just in your position, try using #hashtag to see your message next time!',
const slides = [
    {
        key: 'somethun',
        title: 'title_1_splash',
        text: 'text_1_splash',
        //icon: 'comment-text-multiple',
        animation: world,
        colors: ['#009485', '#40B1A5'],
    },
    {
        key: 'somethun1',
        title: 'title_2_splash', // 'Completely Anonymous',
        text: 'text_2_splash',
        //'Your message are entirely anonymous, you should not use any name or personal information of others.',
        //icon: 'eye-off',
        animation: messages,
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
            //this.setState({ token });
            this.props.navigation.navigate('Main');
        } else {
            this.setState({ token: false });
        }
    }




    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            token: null
        }

    }

    static navigationOptions = {
        header: null,
    };

    _renderItem = (props, that) => {

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

                {props.animation ?     <View style={styles.animationContainer}>
                    <View
                        style={{
                            width: 350,
                            height: 350,
                        }}
                    >
                        {props.animation &&
                        <Lottie
                            ref={(animation) => { if(animation !== null) animation.play()}}

                            style={{
                                width: 350,
                                height: 350,
                                backgroundColor: 'transparent',
                            }}
                            source={props.animation}
                            autoPlay
                            loop

                        />}
                    </View>
                </View>: undefined}

                {props.image ?
                    <React.Fragment >

                        <Image
                            source={require('../assets/images/logo.png')}
                            style={{ width: 165, height: 175 }}
                        />



                        <View style={styles.termsContainer}>
                            <CheckBox
                                containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                                title={i18n.t('terms')} //"You accept the terms and condition"
                                checked={true}
                                textStyle={{color:'transparent', fontFamily: 'merry-reg', letterSpacing: 1.1, fontSize: 16}}
                                checkedColor='transparent'
                            />
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <CheckBox
                                    containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                                    //"You confirm you have read the privacy policy"
                                    checked={that.state.policyChecked}
                                    textStyle={{
                                        color: 'white',
                                        fontFamily: 'merry-reg',
                                        letterSpacing: 1.1,
                                        fontSize: 16
                                    }}
                                    checkedColor='white'
                                    onPress={() => that.setState({policyChecked: !that.state.policyChecked})}
                                />
                                <TouchableOpacity
                                    onPress={()=> {

                                        Linking.openURL(

                                            Localization.locale === 'en' ?
                                                'https://www.iubenda.com/privacy-policy/47792007'
                                                :
                                                'https://www.iubenda.com/privacy-policy/18009329'

                                        ).catch((err) => console.error('An error occurred', err));

                                    } }
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        flex: 1,
                                    }} >
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'merry-reg',
                                        letterSpacing: 1.1,
                                        fontSize: 16,
                                        flexWrap: "wrap",
                                        flex: 1,
                                        textDecorationLine: 'underline'
                                    }}>
                                        {i18n.t('privacy')}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <CheckBox
                                    containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
                                    //"You confirm you have read the privacy policy"
                                    checked={that.state.checked}
                                    textStyle={{
                                        color: 'white',
                                        fontFamily: 'merry-reg',
                                        letterSpacing: 1.1,
                                        fontSize: 16
                                    }}
                                    checkedColor='white'
                                    onPress={() => that.setState({ checked: !that.state.checked })}
                                />
                                <TouchableOpacity
                                    onPress={()=> {

                                        Linking.openURL(
                                                'https://memoriae.app/term'
                                        ).catch((err) => console.error('An error occurred', err));

                                    } }


                                    style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    flex: 1,
                                }} >
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'merry-reg',
                                        letterSpacing: 1.1,
                                        fontSize: 16,
                                        flexWrap: "wrap",
                                        flex: 1,
                                        textDecorationLine: 'underline'
                                    }}>
                                        {i18n.t('terms')}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </React.Fragment>

                    : undefined}

                { props.title !== '' ? <View>
                    <Text style={styles.title}>{i18n.t(props.title)}</Text>
                    <Text style={styles.text}>{i18n.t(props.text)}</Text>
                </View> : undefined }
            </LinearGradient>
        )};


    onDone = async () => {
        await AsyncStorage.setItem('token', '1');

        this.props.navigation.navigate('Main');

    }

    render() {

        console.log("Render Welcome")


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