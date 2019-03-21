import React from 'react';
import {Platform, ScrollView, StyleSheet, View, RefreshControl, Alert, FlatList, ActivityIndicator} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Location, Permissions,DangerZone} from 'expo';
import {Card, Icon, Text, Button, Badge, SearchBar} from 'react-native-elements';
import _ from 'lodash';
const { Lottie } = DangerZone;
import animate from '../animation-w72-h72'
import {connect} from "react-redux";
import { saveGPS } from '../src/actions/gpsActions';
import Headers from "../constants/Headers"
import {addSearchHashtag, deleteMessage, getMessages, refreshing, reportMessage} from "../src/actions/messagesActions";
import Colors from "../constants/Colors";
import i18n from 'i18n-js';


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
        headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'noto-sans-bold',
            fontSize: 26,
            alignSelf: 'center',
            justifyContent: 'center',
            textAlign:"center",
            flex:1
        },
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
            page: 0
        }
    }


    renderSearch = () => {
        const { search } = this.state;

        return (
            <React.Fragment>

                <View style={{backgroundColor: Colors.tintColor, height: 40}}/>
            <View style={{height: 500}}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={this.updateSearch}
                value={search}
            />
            </View>
            </React.Fragment>
        );
    }


    getPosts = () => {
        console.log("HARSH", this.props.longitude, this.props.latitude);
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

 // Your Last Message
    cardFirstElementRender = () => {

        let {lastMessage} = this.props;
        console.log("denmbow", lastMessage)
        if(!_.isEmpty(lastMessage) ) {
            let matches = this.handleText(lastMessage.message);

            console.log("hola", this.props.searchHashtag.toString(), _.intersection(matches, this.props.searchHashtag).toString())
            if(!this.arraysEqual(_.intersection(matches, this.props.searchHashtag), this.props.searchHashtag) && !_.isEmpty(this.props.searchHashtag)) return null;

            return (


                <React.Fragment>

                    <View  style={styles.user}>
                        <Text style={[styles.title, {color: Colors.secondaryColor}] }>{i18n.t('last_message')}</Text>

                        <Text style={styles.name}>{lastMessage.message}</Text>
                        <View style={styles.badgeContainer}>

                            {this.createBadges(lastMessage.message)}
                        </View>
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
                </React.Fragment>




            )
        }

        return null
    };

    handleText = (inputText) => {
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;

        while ((match = regex.exec(inputText))) {
            matches.push(match[1]);
        }

        console.log("match", matches)
        return matches;


    }

    createBadges = (text) => {
        return this.handleText(text).map((elem, i)=>
            <Badge
                onPress={() => {
                    if(this.props.searchHashtag.indexOf(elem) === -1) {
                        let searchHashtag = this.props.searchHashtag;
                        searchHashtag.push(elem);
                        this.props.addSearchHashtag(searchHashtag);
                        this.getPosts();
                    }
                }}
                key={i}
                badgeStyle={{backgroundColor: Colors.secondaryColor, borderRadius: 7, height: 25 }}
                textStyle={{fontSize: 16}}
                value={elem}/>
        )
    }

    cardElementRender = (item, i) => {
        let lastMessage = item.item;
        console.log("Elem", item);
        if(lastMessage.idMessage !== this.props.idLastMessage)
            return (
                <View >

                    <View  style={styles.user}>
                        <Text style={styles.title}> {i18n.t('SAID', {user: lastMessage.idSubmit === null ? '1234' : lastMessage.idSubmit})}</Text>


                        <Text style={styles.name}>{lastMessage.message}</Text>

                        <View style={styles.badgeContainer}>
                            {this.createBadges(lastMessage.message)}
                        </View>
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
                      style={{margin: 10, paddingRight: 5, paddingLeft: 5,
                          borderRadius: 10, backgroundColor: 'white',
                          flexDirection: 'row', alignItems: 'center',
                          justifyContent: 'space-around', alignContent: 'center', flex: 1}}>
                    <Text style={[styles.textLocation, {color: 'black'}]}>
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
                                color="black"
                            />
                        }
                    />
                </View>
            )
        })
    };
    //We weren't able to see any messages in your current location

    // Try posting one!"


    // The app is calculating
    // Your current position!"

    emptyComponent = () => {
        return (
            <View>
                <Text style={styles.textLocation}>
                    {i18n.t('no_messages_1')}
                 </Text>
                <Text style={styles.textlocationBold}>
                    {i18n.t('no_messages_2')}  </Text>
            </View>
        )
    };


    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    getMorePosts = () => {
        console.log("HARSH", this.props.longitude, this.props.latitude);
        this.props.refreshing();
        this.props.getMessages(this.props.longitude, this.props.latitude, this.props.searchHashtag, this.state.page+1);

    };


    render() {
        console.log(this.props.messages);

        let hashTxt = this.renderHashtagsText()
        return this.props.latitude === "" ?
            <View>
                <Text style={styles.textLocation}>
                    {i18n.t('calculating_position_1')}
                    </Text>
                <Text style={styles.textlocationBold}>
                    {i18n.t('calculating_position_2')}

                      </Text>
            </View> : (

                <React.Fragment>

                    <View  style={{backgroundColor: Colors.secondaryColor}}>
                        {
                            _.isEmpty(hashTxt) ?
                                this.renderSearch()
                                :

                                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignSelf: 'center', flex:0}}>

                                    {hashTxt}
                                </View>

                        }


                        <FlatList
                            style={{backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                            onRefresh={this.getPosts}
                            refreshing={this.props.refresh}
                            data={this.props.messages}
                            renderItem={this.cardElementRender}
                            ListHeaderComponent={this.cardFirstElementRender}
                            ListEmptyComponent={this.emptyComponent}
                            ListFooterComponent={this.renderFooter}
                            onEndReached={this.getMorePosts}
                            initialNumToRender={8}
                            maxToRenderPerBatch={2}
                            onEndReachedThreshold={0.5}
                            keyExtractor={(item) => item.idMessage}
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
                            containerStyle={{position: 'absolute', bottom: 30, right: 40}}
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
    searchHashtag: state.Message.searchHashtag
});

const mapDispatchToProps = dispatch =>({
    refreshing: () => dispatch(refreshing()),
    getMessages: (longitude, latitude, hashtags, page) => dispatch(getMessages(longitude, latitude, hashtags, page)),
    deleteMessage: (deleteToken, idMessage) => dispatch(deleteMessage(deleteToken, idMessage)),
    reportMessage: ( idMessage) => dispatch(reportMessage(idMessage)),
    addSearchHashtag: (searchHashtag)  => dispatch(addSearchHashtag(searchHashtag))

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
        fontFamily: 'merry-reg',
        fontSize: 16,
        letterSpacing: 1.05

    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'noto-sans-bold',
        fontSize: 18,
        marginBottom: 10,
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
        marginTop: 7
    },
    textlocationBold:
        {fontFamily: 'space-mono',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 18,
            marginTop: 20,
            marginHorizontal: 20}
});
