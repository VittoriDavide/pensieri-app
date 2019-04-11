import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    BackHandler,
    Alert,
    Dimensions,
    NetInfo
} from 'react-native';
import { Constants, Location, Permissions, TaskManager, DangerZone, LinearGradient} from 'expo';

import { Input, Icon, Badge, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { MonoText } from '../components/StyledText';
import Colors from "../constants/Colors";
import Gps from "../src/reducers/gpsReducer";
import Headers from "../constants/Headers"
import { saveGPS } from '../src/actions/gpsActions';
import {
    configCall,
    filterHash,
    getMemoriaeMessages,
    getMessages,
    sendMessage,
    submitting
} from '../src/actions/messagesActions';
import i18n from 'i18n-js';
import world from '../assets/animations/animation-w1440-h1024-3-w1440-h1024-2'

const { width, height } = Dimensions.get('window');


const isIphoneX = (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)

);



class HomeScreen extends React.Component {
    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor,

        },
        title: `memoriae`,
        headerTintColor: '#fff',
        header:null,
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



    constructor(props) {
        super(props);
        this.state = {
            text: '',
            hashtags: [],
            location: null,
            errorMessage: null,
            requestingLocation: true,
            layout: false,
            submitting: false,
            isConnected: true
        }
    }

    showAlert = (title, text) => {
        Alert.alert(
            title,
            text,
            [
                {text: i18n.t('Ok'), onPress: () => {}},
            ],
            {cancelable: true},
        );
    };

    submitCall = () => {
        if(this.state.text.length < 10 || this.state.text.length > 500) {
            this.showAlert( i18n.t('chars_title'),i18n.t('chars_text') );
            return;
        }

        if((/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g).test(this.state.text)) {
            this.showAlert( i18n.t('url_alert_title'), i18n.t('url_alert_text'));
            return;
        }

        this.props.submitting();

        Promise.all(
            this.props.sendMessage(this.state.text, this.state.hashtags, this.state.location.coords.longitude, this.state.location.coords.latitude, this.props.screenProps.user),
        ).then( () => {

                setTimeout(
                    () =>  {
                        this.props.getMessages(this.state.location.coords.longitude, this.state.location.coords.latitude, this.props.searchHashtag)
                        this.props.filterHash('', this.props.longitude, this.props.latitude)
                    },
                    200

                );
            }
        ).then( () => {
                this.props.navigation.navigate("LinksStack")
                this.setState({hashtags: [], text: ""})

            }
        )
    };

    handleFirstConnectivityChange = (connectionInfo) => {
        console.log(
            'First change, type: ' +
            connectionInfo.type +
            ', effectiveType: ' +
            connectionInfo.effectiveType,
        );

        this.setState({isConnected: connectionInfo.type !== 'none'})

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        NetInfo.removeEventListener('connectionChange', this.handleFirstConnectivityChange);

    }

    handleFirstConnectivityChange = () => {

    };

    handleBackPress = () => {
        BackHandler.exitApp();  // works best when the goBack is async
        return true;
    }

    componentWillMount() {

        this.setState({ requestingLocation: true });
        this._getLocationAsync();

        //Location.watchPositionAsync({timeInterval: 1000*60*5,distanceInterval: 100, accuracy: Location.Accuracy.Balanced }, () =>{
        //   this._getLocationAsync()
        // });

        // TaskManager.defineTask("LOCATION_BACKGROUND", ({ data: { eventType, region }, error }) => {
        //   if (error) {
        // check `error.message` for more details.
        //     return;
        //}
        //if (eventType === Location.GeofencingEventType.Enter) {
        //  console.log("You've entered region:", region);
        //} else if (eventType === Location.GeofencingEventType.Exit) {
        //  console.log("You've left region:", region);
        //}
        //});

    }



    _getLocationAsync = async () => {
        const permission = await Permissions.askAsync(Permissions.LOCATION);
        const providerStatus = await Location.getProviderStatusAsync();
        this.setState({ permission, providerStatus });

        try {
            const timeout = new Promise((resolve, reject) => {
                return setTimeout(() => reject(new Error('Location timeout')), 20 * 1000)
            });

            console.log('location.accuracy', Location.Accuracy)

            const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

            const location = await Promise.race([locationPromise, timeout])

            this.setState({ location })

            this.props.saveGPS(location.coords.longitude, location.coords.latitude);
            this.props.configCall(location.coords.longitude, location.coords.latitude)
            this.props.getMessages(location.coords.longitude, location.coords.latitude, this.props.searchHashtag)
            this.props.filterHash('', this.props.longitude, this.props.latitude)
            this.props.getMemoriaeMessages();

        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
    };



    createBadges = () => {
        return this.state.hashtags.map((elem, i)=>
            <Badge  key={i}
                    value={elem}
                    textStyle={{fontSize: 14, fontFamily: 'noto-sans-reg'}}
                    badgeStyle={{backgroundColor: Colors.secondaryColor, borderRadius: 7, height: 25 }}
            />
        )
    };
    textInputValue = null

    handleText = (inputText) => {

        this.setState({text: inputText});
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;

        while ((match = regex.exec(inputText))) {
            if(!matches.includes(match[1])) {
                matches.push(match[1]);
            }
        }

        console.log("match", matches);
        if (this.state.hashtags !== matches) this.setState({ hashtags: matches })


    };

    addNewTodo = () => {
        const value = this.textInputValue;

        if (value) {
            //this.props.actions.addTodo(value)
            this.input.clear()
            this.textInputValue = null
        }
    }

    shouldShowText = () => {
        console.log("HEL");
        if(!this.state.layout) {
            console.log("1", this.state.layout);

            return true
        }else{
            console.log("2");

            return !this.input.isFocused();
        }
    };

    renderheader = () => {


        return (
            <View style={{backgroundColor: Colors.tintColor, paddingTop: isIphoneX ? 40 : 30, paddingBottom: 10}}>
                <View style={{ flexDirection: 'row',  backgroundColor: Colors.tintColor, alignItems: 'center',justifyContent: 'space-between'}}>
                    <Text style={styles.headerTitleStyle}>memoriae</Text>


                </View>


            </View>
        );
    };


    shouldComponentUpdate(newProps, newState) {
        console.log(newState, this.state)
        return true
    }



    render() {
        console.log("Render Home")


        let text = i18n.t('calculating') ;
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            console.log(this.state.location);

            text = i18n.t('position_found');
        }


        return this.props.submitted ? <View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View> : <React.Fragment>
            {this.renderheader()}

            <View style={styles.container}>

                <LinearGradient
                    style={{height: 10}}
                    colors={['#009485', '#9BE4DC']}
                    start={{x: 1, y: 1}}
                    end={{x: 0, y: 0}}
                >


                    <View style={{height: 10}}/>
                </LinearGradient>


                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                    {this.state.text === "" ? <View style={styles.welcomeContainer}>
                        <Text
                            style={styles.getStartedText}>{i18n.t('welcome', {user: this.props.screenProps.user})} </Text>

                        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>

                            <MonoText style={styles.codeHighlightText}>{text}</MonoText>
                        </View>


                    </View> : undefined}

                    {this.state.text !== "" ? <Button

                        onPress={this.submitCall}
                        containerStyle={{alignSelf: 'flex-end', marginVertical: 5, marginRight: 24}}
                        buttonStyle={{backgroundColor: Colors.secondaryColor, alignSelf: 'flex-start'}}
                        title="Send"
                        titleStyle={{fontFamily: 'space-mono'}}
                        raised
                    /> : undefined}

                    <View style={styles.badgeContainer}>
                        {this.createBadges()}
                    </View>


                    {this.state.location !== null ? <View style={styles.inputStyle}>
                        <Input

                            placeholder='Input text'
                            leftIcon={{
                                type: 'font-awesome', name: 'chevron-right',
                                size: 20, color: this.state.text === "" ? 'black' : Colors.secondaryColor
                            }}
                            inputContainerStyle={styles.inputContainerStyle}
                            ref={input => {
                                this.input = input;
                            }}
                            multiline={true}
                            leftIconContainerStyle={styles.leftIconContainerStyle}
                            inputStyle={{alignSelf: 'flex-end', minHeight: 20}}
                            onChangeText={(text) => this.handleText(text)}
                            value={this.state.text}
                            maxLength={200}
                            keyboardType={Platform.OS === 'ios' ? 'twitter' : 'default'}
                            onFocus={(e) => console.log(e)}
                        />

                    </View> : undefined}

                </ScrollView>
            </View>
        </React.Fragment>;
    }


}

const mapStateToProps = state => ({
    longitude: state.Gps.longitude,
    latitude: state.Gps.latitude,
    submitted: state.Message.submitted,
    searchHashtag: state.Message.searchHashtag
});

const mapDispatchToProps = dispatch =>({
    saveGPS: (longitude, latitude) => dispatch(saveGPS(longitude, latitude)),
    configCall: (longitude, latitude) => dispatch(configCall(longitude, latitude)),
    getMessages: (longitude, latitude, hashtag) => dispatch(getMessages(longitude, latitude, hashtag)),
    sendMessage: (message, hashtag, longitude, latitude, idSubmit) => dispatch(sendMessage(message, hashtag, longitude, latitude, idSubmit)),
    submitting: () => dispatch(submitting()),
    filterHash: (message, longitude, latitude) => dispatch(filterHash(message, longitude, latitude)),
    getMemoriaeMessages: () => dispatch(getMemoriaeMessages())


});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    badgeContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        flexWrap: 'wrap'
    },
    inputContainerStyle: {
        borderColor: '#fff',
        justifyContent: 'flex-start'
    },
    inputStyle: {
        width: '100%',
        borderBottomWidth: 0

    },
    leftIconContainerStyle: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: 5
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,

    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'flex-start',
        marginHorizontal: 50,
        marginLeft: 7
    },
    homeScreenFilename: {
        marginVertical: 7,
        marginLeft: 7
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
        fontFamily: 'noto-sans-light',
        fontSize: 20
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,

    },
    getStartedText: {
        fontSize: 28,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'noto-sans-bold',
        fontFamily: 'noto-sans-bold',
        fontWeight: 'bold',
        marginLeft: 7,


    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },

    animationContainerBack: {
        backgroundColor: '#fff',

        zIndex: 0,
        position: 'absolute',
        bottom: 100,
        right: -400
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'noto-sans-bold',
        fontSize: 26,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign:"center",
        flex:1,
        color: 'white'
    }
});
