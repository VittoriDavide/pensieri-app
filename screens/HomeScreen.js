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
    BackHandler

} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import { Input, Icon, Badge, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { MonoText } from '../components/StyledText';
import Colors from "../constants/Colors";
import Gps from "../src/reducers/gpsReducer";
import Headers from "../constants/Headers"
import { saveGPS } from '../src/actions/gpsActions';
import {configCall, getMessages, sendMessage, submitting} from '../src/actions/messagesActions';
import i18n from 'i18n-js';

class HomeScreen extends React.Component {
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

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            hashtags: [],
            location: null,
            errorMessage: null,
            requestingLocation: true,
            layout: false,
            submitting: false
        }
    }

    submitCall = () => {

        this.props.submitting();

        Promise.all(
            this.props.sendMessage(this.state.text, this.state.hashtags, this.state.location.coords.longitude, this.state.location.coords.latitude, this.props.screenProps.user),
        ).then( () => {

                setTimeout(
                    () =>  this.props.getMessages(this.state.location.coords.longitude, this.state.location.coords.latitude, this.props.searchHashtag),
                    200
                );
            }
        ).then( () => {
                this.props.navigation.navigate("LinksStack")
                this.setState({hashtags: [], text: ""})

            }
        )

    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        BackHandler.exitApp();  // works best when the goBack is async
        return true;
    }

    componentWillMount() {

        this.setState({ requestingLocation: true });

        this._getLocationAsync();

    }



    _getLocationAsync = async () => {
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
            this.props.saveGPS(location.coords.longitude, location.coords.latitude);
            this.props.configCall(location.coords.longitude, location.coords.latitude)
            this.props.getMessages(location.coords.longitude, location.coords.latitude, this.props.searchHashtag)
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
    }



    createBadges = () => {
        return this.state.hashtags.map((elem, i)=>
            <Badge  key={i}
                    badgeStyle={{backgroundColor: Colors.secondaryColor}}
                    value={elem}
                    textStyle={{fontSize: 14, fontFamily: 'noto-sans-reg'}}
                    badgeStyle={{backgroundColor: Colors.secondaryColor, borderRadius: 7, height: 25 }}
            />
        )
    }

    handleText = (inputText) => {
        this.setState({text: inputText});
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;

        while ((match = regex.exec(inputText))) {
            matches.push(match[1]);
        }

        console.log("match", matches)
        this.setState({hashtags: matches})


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
    }

    render() {


        let text = i18n.t('calculating') ;
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            console.log(this.state.location);

            text = i18n.t('position_found');
        }


        return this.props.submitted ?

            (
                <View style={styles.container}>
                    <ActivityIndicator size="large"  />
                </View>

            ) : (
                <View style={styles.container}>
                    <View style={{backgroundColor: Colors.secondaryColor, height: 10}} />



                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        {this.state.text === "" ? <View style={styles.welcomeContainer}>
                            <Text style={styles.getStartedText}>{i18n.t('welcome', {user: this.props.screenProps.user})} </Text>

                            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>

                                <MonoText style={styles.codeHighlightText}>{text}</MonoText>
                            </View>



                        </View>: undefined}

                        {this.state.text !== "" ? <Button
                            onPress={ this.submitCall}
                            containerStyle={{alignSelf: 'flex-end', marginVertical: 5 , marginRight: 24}}
                            buttonStyle={{backgroundColor: Colors.secondaryColor, alignSelf: 'flex-start'}}
                            title="Send"
                            titleStyle={{fontFamily: 'space-mono' }}
                            raised

                        /> : undefined}

                        <View style={styles.badgeContainer}>

                            {this.createBadges()}
                        </View>

                        {this.state.location !== null ? <View style={styles.inputStyle}>
                            <Input
                                placeholder='Input text'
                                leftIcon={{ type: 'font-awesome', name: 'chevron-right',
                                    size: 20, color: this.state.text === "" ? 'black' : Colors.secondaryColor }}
                                inputContainerStyle={styles.inputContainerStyle}
                                ref={input => {
                                    this.input = input;
                                }}
                                onLayout={() => this.setState({layout: true})}
                                multiline={true}
                                leftIconContainerStyle={styles.leftIconContainerStyle}
                                inputStyle={{alignSelf: 'flex-end', minHeight: 20}}
                                onChangeText={(text) => this.handleText(text) }
                                value={this.state.text}
                                maxLength={200}
                                keyboardType={Platform.OS === 'ios' ? 'twitter' : 'default'}
                                onFocus={(e) => console.log(e)}
                            />

                        </View> : undefined }



                    </ScrollView>


                </View>
            );
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
    submitting: () => dispatch(submitting())

});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontFamily: 'noto-sans-black',
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
});
