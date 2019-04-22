
import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, Platform, ScrollView} from 'react-native';
import {DangerZone, LinearGradient} from 'expo';
import {Text, Icon, Button, Badge} from 'react-native-elements';
const { Lottie } = DangerZone;
import animate from '../assets/animations/animation-w72-h72'
import Colors from "../constants/Colors";
import {connect} from "react-redux";
import {addSearchHashtag, deleteMessage, getMessages, refreshing, reportMessage} from "../src/actions/messagesActions";
import moment from 'moment';
import i18n from 'i18n-js';
const { width, height } = Dimensions.get('window');
import world from '../assets/animations/animation-w1440-h1024-3-w1440-h1024-2'
import {gs} from '../constants/GlobalStyle';


const isIphoneX = (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)

);
class SettingsScreen extends React.Component {
    state = {
        animation: animate,
        activeIndex: 0
    };
    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor,

        },
        title: `memoriae`,

        header: null,
        headerTintColor: '#fff',
        headerTitleStyle: gs.headerTitleStyle


    };

    renderMessage = () => {
        return (
            <View style={{marginRight: 20, flexDirection: 'row', alignSelf: 'center' }}>

                <View style={{marginTop: 30, justifyContent: 'center'}}>

                    {i18n.t('us_screen_text') !== "" ?
                        <Text style={styles.textStyle}>{i18n.t('us_screen_text')}</Text>
                        :
                        undefined }

                    {i18n.t('to_die') !== "" ? <Text style={styles.textStyle2}>
                            {this.secondsToHms()}
                            {i18n.t('to_die')}</Text>
                        : undefined }

                    { i18n.t('hour_rate', { hourRate: this.props.hourRate }) !== "" ?
                        <Text style={styles.textStyle}>{i18n.t('hour_rate', { hourRate: this.props.hourRate })} </Text>
                        : undefined }

                    { i18n.t('donate') !== "" ? <Text style={styles.textStyle3}>{i18n.t('donate')}</Text> : undefined }
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Button
                            containerStyle={{alignSelf: 'flex-end'}}
                            buttonStyle={{backgroundColor: Colors.secondaryColor, alignSelf: 'flex-end', paddingBottom: 10}}
                            title= {i18n.t('give_me_live')}
                            raised
                        />
                        <Text style={{fontFamily: 'noto-sans-bold', fontSize: 36, alignSelf: 'flex-end'}}>{i18n.t('memoriae')}</Text>
                    </View>
                </View>
            </View>

        )
    }

    handleText = (inputText) => {
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;

        while ((match = regex.exec(inputText))) {
            if(!matches.includes(match[1])) {
                matches.push(match[1]);
            }
        }

        return matches;


    };


    createBadges = (text) => {
        return this.handleText(text).map((elem, i)=>
            <Badge
                key={i}
                badgeStyle={gs.badgeStyle}
                textStyle={{fontSize: 16}}
                value={elem}/>
        )
    }


    cardElementRender = (item, i) => {
        let lastMessage = item.item;
        if(lastMessage.text.indexOf("{{memoriae}}") !== -1 ) {
            return (
                <View  style={styles.helloMessage}>

                    {this.renderMessage()}
                </View>
        )
        }else {
            return (
                <View  style={styles.message}>
                    <Text style={styles.title}>{i18n.t('SAID', {user: '001' } ) }</Text>

                    <View style={styles.badgeContainer}>
                        {this.createBadges(lastMessage.text)}
                    </View>


                    <Text style={styles.name}>{lastMessage.text}</Text>
                </View>
            )
        }

    };

    secondsToHms = () => {

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

    _renderPagination = () => {

        return (
            <View style={styles.paginationContainer}>
                <View style={styles.paginationDots}>
                    {this.props.memoriaeMessage.length > 1 && this.props.memoriaeMessage.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === this.state.activeIndex ? styles.activeDotStyle : styles.dotStyle,
                            ]}
                        />
                    ))}
                </View>
            </View>
        )
    };

    _onMomentumScrollEnd = (e) => {
        const offset = e.nativeEvent.contentOffset.x;
        // Touching very very quickly and continuous brings about
        // a variation close to - but not quite - the width.
        // That's why we round the number.
        // Also, Android phones and their weird numbers
        const newIndex = Math.round(offset / width);
        if (newIndex === this.state.activeIndex) {
            // No page change, don't do anything
            return;
        }
        const lastIndex = this.state.activeIndex;
        this.setState({ activeIndex: newIndex });
    };
    renderheader = () => {


        return (
            <View style={{backgroundColor: Colors.tintColor, paddingTop: isIphoneX ? 40 : 30, paddingBottom: 10}}>
                <View style={{ flexDirection: 'row',  backgroundColor: Colors.tintColor, alignItems: 'center',justifyContent: 'space-between'}}>
                    <Text style={gs.headerTitleStyle}>memoriae</Text>


                </View>


            </View>
        );
    };


    //Life of own server...

    //to die
    //"Give me life"

    // Every {this.props.hourRate}$ give 1 hour of live
    render() {
        console.log("Render Settings")


        console.log("puttanina", this.props.lifetime);
        return (
            <React.Fragment>


                {this.renderheader()}
                <LinearGradient
                    style={{height: 10}}
                    colors={['#9BE4DC', '#009485' ]}
                    start={{x: 1, y: 1}}
                    end={{x: 0, y: 0}}
                >


                    <View style={{height: 10}}/>
                </LinearGradient>
                <ScrollView>
                    <View style={{ flexDirection: 'column' , backgroundColor: '#FFFFFF55', justifyContent: 'space-between', height: '100%'}}>
                        <View>
                            <FlatList
                                ref={(list) => this.horizontalFlat = list}
                                horizontal
                                data={this.props.memoriaeMessage}
                                renderItem={this.cardElementRender}
                                keyExtractor={(item, index) => {  return index } }
                                bounces={false}
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={this._onMomentumScrollEnd}


                            />
                            {this._renderPagination()}
                        </View>

                    </View>
                </ScrollView>

            </React.Fragment>

        );
    }



    renderCardioAnimation = () => {
        return (
            <View
                style={{
                    width: 100,
                    height: 100,
                }}
            >
                <Lottie
                    ref={(animation) => animation.play()}

                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'transparent',
                    }}
                    source={cardio}
                    autoPlay
                    loop

                />
            </View>


        )
    }
}


const mapStateToProps = state => ({
    hourRate: state.Message.hourRate,
    lifetime: state.Message.lifetime,
    memoriaeMessage: state.Message.memoriaeMessage
});


const mapDispatchToProps = dispatch =>({
    refreshing: () => dispatch(refreshing()),

});

export default connect(mapStateToProps, mapDispatchToProps())(SettingsScreen)

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
        marginRight: 20,
    },
    buttonContainer: {
        paddingTop: 20,
    },
    textStyle: {
        fontFamily: 'noto-sans-bold',
        letterSpacing: 0.9,
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginVertical: 5

    },
    textStyle2: {
        fontFamily: 'noto-sans-reg',
        letterSpacing: 0.9,
        fontSize: 16,
        alignSelf: 'flex-end',
        marginVertical: 5

    },
    textStyle3: {
        fontFamily: 'noto-sans-bold',
        letterSpacing: 0.9,
        fontSize: 20,
        fontWeight: '800',
        alignSelf: 'flex-end',
        marginVertical: 5

    },
    user: {
        justifyContent: 'center',
        marginVertical: 10,
        textAlign: 'center',
        width: width,

    },
    message: {
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
        width: width,
    },
    helloMessage: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginVertical: 20,
        textAlign: 'center',
        width: width,

    },
    name: {
        textAlign: 'left',
        fontFamily: 'space-mono',
        fontSize: 18,
        letterSpacing: 1.05

    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        marginVertical: 7
    },
    title: {
        textAlign: 'center',
        fontFamily: 'noto-sans-bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'gray'
    },
    paginationDots: {
        height: 16,
        margin: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
        backgroundColor: 'black'
    },


    leftButtonContainer: {
        position: 'absolute',
        left: 0,
    },
    rightButtonContainer: {
        position: 'absolute',
        right: 0,
    },
    bottomButtonContainer: {
        height: 44,
        marginHorizontal: 16,
    },
    bottomButton: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomButtonDisabled: {
        flex: 1,
        backgroundColor:  'rgba(0, 0, 0, .3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
        padding: 12,
    },
    activeDotStyle: {
        backgroundColor: 'rgb(0, 0, 0)',
    },
    dotStyle: {
        backgroundColor: 'rgba(0, 0, 0, .2)',
    },

    headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'noto-sans-bold',
        fontSize: 26,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign:"center",
        flex:1,
        padding: 3,
        color: 'white'
    },
    animationContainerBack: {
        backgroundColor: '#fff',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        zIndex: 0,
        position: 'absolute',
        bottom: height/20,
        right: 0
    }
});
