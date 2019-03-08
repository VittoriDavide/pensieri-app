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

} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import { Input, Icon, Badge, Button } from 'react-native-elements';


import { MonoText } from '../components/StyledText';
import Colors from "../constants/Colors";

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
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
        this.setState({submitting: true});
        fetch('http://54.38.65.73/submit', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-App-Version': 11
            },
            body: JSON.stringify({
                message: this.state.text,
                hashtag: this.state.hashtags,
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);
                this.setState({text: '', hashtags: [], submitting: false})
            })
    }

    componentWillMount() {

        this.setState({ requestingLocation: true });
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location, requestingLocation: false });
    };

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
        } catch (err) {
            this.setState({ location: err.message })
        }
    }



    createBadges = () => {

        return this.state.hashtags.map((elem, i)=>

            <Badge  key={i}
                    badgeStyle={{backgroundColor: '#8c1515'}}
                    value={elem}/>
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

    //If the layout is not ready we cannot call this.input
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
    componentDidUpdate() {
        console.log("hey")
    }
    render() {


        let text = 'Calculating your current position...';
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            console.log(this.state.location);

            text = "Position Found!";
        }


        return this.state.submitting ?

            (
                <View style={styles.container}>
                    <ActivityIndicator size="large"  />
                </View>

            ) : (
            <View style={styles.container}>



                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    {this.state.text === "" ? <View style={styles.welcomeContainer}>
                        <Text style={styles.getStartedText}>Welcome 0123456 </Text>

                        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>

                            <MonoText style={styles.codeHighlightText}>{text}</MonoText>
                        </View>



                    </View>: undefined}

                    {this.state.text !== "" ? <Button
                        onPress={ this.submitCall}
                        containerStyle={{alignSelf: 'flex-end', marginVertical: 5 , marginRight: 24}}
                        buttonStyle={{backgroundColor: 'white', alignSelf: 'flex-start'}}
                        title="Send"
                        titleStyle={{fontFamily: 'space-mono', color: '#8c1515'}}
                        colo

                    /> : undefined}

                    <View style={{flexDirection: 'row', marginHorizontal: 24, flexWrap: 'wrap'}}>

                        {this.createBadges()}
                    </View>

                    {this.state.location !== null ? <View style={styles.inputStyle}>
                        <Input
                            placeholder='Input text'
                            leftIcon={{ type: 'font-awesome', name: 'chevron-right', size: 20 }}
                            inputContainerStyle={{borderColor: '#fff', justifyContent: 'flex-start'}}
                            ref={input => {
                                this.input = input;
                            }}
                            onLayout={() => this.setState({layout: true})}
                            multiline={true}
                            leftIconContainerStyle={{alignSelf: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 5}}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputStyle: {
        width: '100%',
        borderBottomWidth: 0

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
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 28,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'left',
        fontFamily: 'space-mono',
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
