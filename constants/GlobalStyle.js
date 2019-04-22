import {StyleSheet, Dimensions} from 'react-native';
import Colors from "./Colors";
const { width, height } = Dimensions.get('window');

export const gs = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
        marginRight: 20,
    },
    badgeStyle: {
        backgroundColor: Colors.secondaryColor,
        borderRadius: 7,
        height: 25
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
