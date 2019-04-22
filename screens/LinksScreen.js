import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    View,
    RefreshControl,
    Alert,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    LayoutAnimation,
    NativeModules,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Location, Permissions, DangerZone, LinearGradient} from 'expo';
import {Card, Icon, Text, Button, Badge, SearchBar} from 'react-native-elements';
import _ from 'lodash';
const { Lottie } = DangerZone;
import animate from '../assets/animations/animation-w250-h250'
import refresh from '../assets/animations/animation-w600-h500'
import {connect} from "react-redux";
import { saveGPS } from '../src/actions/gpsActions';
import Headers from "../constants/Headers"
import tag from '../assets/animations/animation-w1000-h1000'
const { width, height } = Dimensions.get('window');

import {
    addSearchHashtag, deleteFilterHashTag,
    deleteMessage,
    filterHash,
    getMessages,
    refreshing,
    reportMessage
} from "../src/actions/messagesActions";
import Colors from "../constants/Colors";
import i18n from 'i18n-js';
import animation from '../assets/animations/animation-w250-h250'
import world from '../assets/animations/animation-w1440-h1024-3-w1440-h1024-2'
import {gs} from '../constants/GlobalStyle';

const isIphoneX = (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)

);

class RightButton extends React.Component {
    render() {
        return (
            <View>
                <Button
                    buttonStyle={{backgroundColor: 'transparent'}}
                    containerStyle={{alignSelf: 'flex-start'}}
                    icon={
                        <Icon
                            name="comment-search-outline"
                            size={25}
                            type={"material-community"}
                            color="white"
                            reversed
                        />
                    }
                />
            </View>
        )
    }
}

class LinksScreen extends React.Component {
    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor,

        },
        title: `memoriae`,
        headerTintColor: '#fff',
        headerTitleStyle: gs.headerTitleStyle,
        header:null,
        headerRight: <RightButton/>

    };

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            errorMessage: '',
            refreshing: false,
            location: null,
            loading: false,
            page: 0,
            search: '',
            animation: animation,
            refresh: refresh

        }
    }

    debounce = (func, wait, immediate)  => {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    updateSearch = (search) =>{
        this.debounce(this.props.filterHash(search.toLowerCase(), this.props.longitude, this.props.latitude), 500, false);
        this.setState({search});
    };

    renderHashFilter = ({item, i }) => {
        let selected =  this.props.searchHashtag.includes(item);
        return (
            <TouchableOpacity onPress={() => {  if(!selected) this.addHashtagToList(item.toLowerCase())
            else this.deleteHashtag(item.toLowerCase())  }} style={{
                paddingRight: 5, paddingLeft: 5, height: 30,
                marginHorizontal: 5,
                backgroundColor:  selected ?  Colors.secondaryColor  : Colors.tintColor,
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-around', alignContent: 'center',
                borderRight: 1,
                borderColor: 'white', marginVertical: 7,
                borderWidth: selected ? 0 : 0,
                borderRadius: 20
            }}>
                <Text style={[styles.textLocation, {color: 'white'}]}>
                    #{item}
                </Text>

            </TouchableOpacity>)
    };


    renderSearch = () => {
        const { search } = this.state;


        return (
            <React.Fragment>
                <View style={{backgroundColor: Colors.tintColor, paddingTop: isIphoneX ? 40 : 30, paddingBottom: 10}}>
                    <View style={{flexDirection: 'row', backgroundColor: Colors.tintColor, alignItems: 'center', justifyContent: 'space-between'}}>

                        <Icon
                            underlayColor={Colors.tintColor}
                            name={this.state.showSearch ? "arrowright" : "md-search"}
                            size={25}
                            type={this.state.showSearch ? "antdesign" : "ionicon"}
                            color={Colors.tintColor}
                            containerStyle={{marginHorizontal: 10}}
                        />

                        {this.state.showSearch ? <SearchBar
                            placeholder="Type Here..."
                            onChangeText={this.updateSearch}
                            inputStyle={{maxHeight: 30}}
                            value={search}
                            containerStyle={{
                                padding: 0,
                                backgroundColor: Colors.tintColor,
                                borderTopColor: Colors.tintColor,
                                borderBottomColor: Colors.tintColor,
                                flex: 1}}
                        /> :  <Text style={gs.headerTitleStyle}>memoriae</Text>}

                        <Icon
                            underlayColor={Colors.tintColor}
                            onPress={() => {
                                this.setState({showSearch: !this.state.showSearch});
                                this.updateSearch('');
                            }}
                            name={this.state.showSearch ? "arrowright" : "md-search"}
                            size={25}
                            type={this.state.showSearch ? "antdesign" : "ionicon"}
                            color="white"
                            containerStyle={{marginHorizontal: 10}}
                        />

                    </View>

                    <View style={{backgroundColor: Colors.tintColor, marginBottom: 0}}>

                        <FlatList
                            ref={(list) => this.horizontalFlat = list}
                            horizontal
                            data={_.uniqWith([...this.props.searchHashtag.map((e) => e.toLowerCase()), ...this.props.hashes])}
                            renderItem={this.renderHashFilter}
                            keyExtractor={(item, index) => {  return index } }
                            bounces={false}
                        />


                    </View>

                </View>

                <LinearGradient
                    style={{height: 10}}
                    colors={['#009485',  '#9BE4DC',  '#009485']}
                    start={{x: 1, y: 1}}
                    end={{x: 0, y: 0}}
                >

                    <View style={{height: 10}}/>

                </LinearGradient>

            </React.Fragment>
        );
    };



    getPosts = () => {

        this.props.refreshing();
        this.setState({page: 0});
        this.props.getMessages(this.props.longitude, this.props.latitude, this.props.searchHashtag);
    };


    arraysEqual = (_arr1, _arr2) => {

        if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
            return false;

        var arr1 = _arr1.concat().sort();
        var arr2 = _arr2.concat().sort();

        for (var i = 0; i < arr1.length; i++) {

            if (arr1[i] !== arr2[i])
                return false;

        }

        return true;

    }

    componentDidUpdate() {
        if(this.props.searchHashtag > 5) this.horizontalFlat.scrollToOffset({offset: 25})
    }

    // Your Last Message
    cardFirstElementRender = () => {

        let {lastMessage} = this.props;
        if(!_.isEmpty(lastMessage) ) {
            let matches = this.handleText(lastMessage.message);

            if(!this.arraysEqual(_.intersection(matches, this.props.searchHashtag), this.props.searchHashtag) && !_.isEmpty(this.props.searchHashtag)) return null;

            return (


                <View style={{backgroundColor: '#ffffff77'}}>

                    <View  style={styles.user}>
                        <Text style={[styles.title, {color: Colors.secondaryColor}] }>{i18n.t('last_message')}</Text>
                        <View style={styles.badgeContainer}>
                            {this.createBadges(lastMessage.message)}

                        </View>
                        <Text style={styles.name}>{lastMessage.message}</Text>

                        <View  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            {lastMessage.deletable ? <Button
                                buttonStyle={{backgroundColor: 'transparent'}}
                                containerStyle={{alignSelf: 'flex-start'}}
                                onPress={this.showAlertDelete}
                                icon={
                                    <Icon
                                        name="delete"
                                        size={25}
                                        type={"antdesign"}
                                        color="black"
                                        reversed
                                    />
                                }
                            /> : undefined }

                            <Button
                                buttonStyle={{backgroundColor: 'transparent'}}
                                containerStyle={{alignSelf: 'flex-start'}}
                                onPress={() => this.showAlertNotify(this.props.idLastMessage)}
                                icon={
                                    <Icon
                                        name="alert-octagon"
                                        size={25}
                                        type="feather"
                                        color="black"

                                        reversed
                                    />
                                }
                            />
                        </View>

                    </View>

                    <View style={styles.separator} />
                </View>




            )
        }

        return null
    };


    addHashtagToList = (elem) => {
        if(this.props.searchHashtag.indexOf(elem) === -1) {
            let searchHashtag = this.props.searchHashtag;
            searchHashtag.push(elem);
            this.props.addSearchHashtag(searchHashtag);
            this.getPosts();
        }
    };

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
                onPress={() => this.addHashtagToList(elem.toLowerCase())}
                key={i}
                badgeStyle={gs.badgeStyle}
                textStyle={{fontSize: 16}}
                value={elem}/>
        )
    }

    cardElementRender = (item, i) => {
        let lastMessage = item.item;
        if(lastMessage.idMessage !== this.props.idLastMessage)
            return (
                <View style={{backgroundColor: '#ffffff77'}}>

                    <View  style={styles.user}>
                        <Text style={styles.title}> {i18n.t('SAID', {user: lastMessage.idSubmit === null ? '1234' : lastMessage.idSubmit})}</Text>

                        <View style={styles.badgeContainer}>
                            {this.createBadges(lastMessage.message)}
                        </View>

                        <Text style={styles.name}>{lastMessage.message}</Text>


                        <View  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>

                            <Button
                                buttonStyle={{backgroundColor: 'transparent'}}
                                containerStyle={{alignSelf: 'flex-start'}}
                                onPress={() => this.showAlertNotify(lastMessage.idMessage)}
                                icon={
                                    <Icon
                                        name="alert-octagon"
                                        size={25}
                                        type="feather"
                                        color="black"
                                        reversed
                                    />
                                }
                            />
                        </View>
                    </View>
                </View>


            )
    };

    //'Are you sure you want to delete this message?'

    showAlertDelete = () => {
        Alert.alert(
            i18n.t('delete_title'),
            i18n.t('delete_text'),
            [
                {text: i18n.t('Cancel'), onPress: () => console.log('Ask me later pressed')},
                {text: i18n.t('Ok'), onPress: () =>

                        Promise.all(
                            this.props.deleteMessage(this.props.deleteTokenLastMessage, this.props.idLastMessage),

                        ).then( () => {

                                setTimeout(
                                    () => this.getPosts(),
                                    200
                                );
                            }
                        )
                },
            ],
            {cancelable: true},
        );
    };

    //'Report Message',
    //'Are you sure you want to report this message?',

    showAlertNotify = (idLastMessage) => {
        Alert.alert(
            i18n.t('report_title'),
            i18n.t('report_text'),
            [
                {text: i18n.t('Cancel'), onPress: () => console.log('Ask me later pressed')},
                {text: i18n.t('Ok'), onPress: () => this.props.reportMessage(idLastMessage)},
            ],
            {cancelable: true},
        );
    };

    deleteHashtag = (elem) => {
        let hashArray = this.props.searchHashtag;
        hashArray.splice(this.props.searchHashtag.indexOf(elem), 1);
        this.props.addSearchHashtag(hashArray);
        this.props.refreshing();
        this.props.getMessages(this.props.longitude, this.props.latitude, hashArray);
    };


    renderHashtagsText = () => {
        return this.props.searchHashtag.map( (elem, i ) => {
            return (
                <View key={i}
                      style={{marginBottom: 10, marginRight: 10, paddingRight: 5, paddingLeft: 5,
                          borderRadius: 10, backgroundColor: Colors.secondaryColor,
                          flexDirection: 'row', alignItems: 'center',
                          justifyContent: 'space-around', alignContent: 'center'}}>
                    <Text style={[styles.textLocation, {color: 'white'}]}>
                        #{elem}
                    </Text>
                    <Button
                        buttonStyle={{backgroundColor: 'transparent', padding: 0}}
                        containerStyle={{paddingLeft: 10}}
                        iconContainerStyle={{padding: 0}}
                        onPress={() => this.deleteHashtag(elem)}
                        icon={
                            <Icon
                                name="not-interested"
                                size={15}
                                color="white"
                            />
                        }
                    />
                </View>
            )
        })
    };

    // We weren't able to see any messages in your current location

    // Try posting one!
    // The app is calculating
    // Your current position!

    renderFooter = () => {

        return (
            <View
                style={{
                    marginVertical: 70,
                }}
            >
            </View>
        );
    };

    getMorePosts = () => {
        this.props.getMessages(this.props.longitude, this.props.latitude, this.props.searchHashtag, this.state.page+1);
    };



    emptyComponent = () => {
        if(this.props.longitude === "")  {
            return (
                <View style={styles.animationContainer}>
                    <View
                        style={{
                            width: 150,
                            height: 150,
                        }}
                    >

                    </View>

                </View>
            );
        }

        if(!_.isEmpty(this.props.hashes)) {
            return (
                <React.Fragment>
                    <View style={{margin: 20}}>
                        <Text style={styles.textLocation}>
                            {i18n.t('no_hashes_1')}
                            {": "}

                        </Text>
                        <Text style={styles.textlocationBold}>

                            {this.props.searchHashtag.map((item) => '#' + item + ' ')}
                        </Text>

                        <Text style={styles.textlocationBold}>
                            {i18n.t('no_hashes_2')}
                        </Text>
                    </View>

                </React.Fragment>

            )
        }

        return (
            <View style={{margin: 20}}>
                <Text style={styles.textLocation}>
                    {i18n.t('no_messages_1')}
                </Text>
                <Text style={styles.textlocationBold}>
                    {i18n.t('no_messages_2')}  </Text>
            </View>
        )
    }

    refreshControlComponent = () => {
        return (
            <View
                style={{
                    width: 150,
                    height: 150,
                }}
            >
                {this.state.refresh &&
                <Lottie
                    ref={(animation) => animation.play()}

                    style={{
                        width: 150,
                        height: 150,
                        backgroundColor: '#fff',
                    }}
                    source={this.state.refresh}
                    autoPlay
                    loop

                />}
            </View>

        )
    };

    render() {
        let hashTxt = this.renderHashtagsText();
        return  (
            <React.Fragment >
                <View style={styles.animationContainerBack}>
                    <View
                        style={{
                            width: height/1.3,
                            height: height/1.3,
                        }}
                    >
                    </View>
                </View>
                {this.renderSearch()}
                <View  style={{backgroundColor: 'transparent'}}>

                    <FlatList
                        style={{backgroundColor: 'transparent', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                        onRefresh={this.getPosts}
                        refreshing={this.props.refresh}
                        data={this.props.messages}
                        renderItem={this.cardElementRender}
                        ListHeaderComponent={this.cardFirstElementRender}
                        ListEmptyComponent={this.emptyComponent}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.getMorePosts}
                        initialNumToRender={20}
                        maxToRenderPerBatch={2}
                        onEndReachedThreshold={0.5}
                        keyExtractor={(item) => { return "" +item.idMessage}}
                        ItemSeparatorComponent={ ({highlighted}) => (
                            <View style={styles.separator} />
                        )}
                    />
                </View>
                { !_.isEmpty(this.props.searchHashtag) ?

                    <Icon
                        reverse
                        name='md-refresh'
                        type='ionicon'
                        color={Colors.secondaryColor}
                        containerStyle={{position: 'absolute', bottom: 30, right: 20}}
                        onPress={() =>  {


                            Promise.all(
                                this.props.addSearchHashtag([])
                            ).then( () => {

                                    setTimeout(
                                        () => this.getPosts(),
                                        200
                                    );
                                }
                            )

                        } }
                    /> : undefined}

            </React.Fragment>



        );
    }
}


const mapStateToProps = state => ({
    longitude: state.Gps.longitude,
    latitude: state.Gps.latitude,
    messages: state.Message.messages,
    refresh: state.Message.refresh,
    lastMessage: state.Message.lastMessage,
    idLastMessage:state.Message.idLastMessage,
    deleteTokenLastMessage: state.Message.deleteTokenLastMessage,
    searchHashtag: state.Message.searchHashtag,
    hashes: state.Message.hashes
});

const mapDispatchToProps = dispatch =>({
    refreshing: () => dispatch(refreshing()),
    getMessages: (longitude, latitude, hashtags, page) => dispatch(getMessages(longitude, latitude, hashtags, page)),
    deleteMessage: (deleteToken, idMessage) => dispatch(deleteMessage(deleteToken, idMessage)),
    reportMessage: ( idMessage) => dispatch(reportMessage(idMessage)),
    addSearchHashtag: (searchHashtag)  => dispatch(addSearchHashtag(searchHashtag)),
    filterHash: (message, longitude, latitude) => dispatch(filterHash(message, longitude, latitude)),
    deleteFilterHashTag: () => dispatch(deleteFilterHashTag())

});

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
    },

    separator: {
        height: 1,
        width: "86%",

        backgroundColor:  "#CED0CE",
        marginLeft: '7%',
        marginRight: '7%'

    },
    user: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 10

    },
    name: {
        textAlign: 'center',
        fontFamily: 'space-mono',
        fontSize: 16,
        letterSpacing: 1.05

    },
    title: {
        textAlign: 'center',
        fontFamily: 'noto-sans-bold',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'gray'
    },
    titleHash: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'noto-sans-bold',
        fontSize: 14,
        color: 'white'
    },
    textLocation: {
        fontFamily: 'noto-sans-reg',
        textAlign: 'center',
        fontSize: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 7
    },
    textlocationBold:
        {
            fontFamily: 'noto-sans-bold',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 18,
            marginTop: 20,
            marginHorizontal: 20},
    animationContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'noto-sans-bold',
        fontSize: 26,
        padding: 3,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign:"center",
        flex:1,
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
        right: -width/3
    }
});
