import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Button, Image } from 'react-native-elements';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

import animation from '../animation-w300-h300';
const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {

    state = {
        animation: animation,
    };

    componentDidMount() {
        this._playAnimation();
    }


    _playAnimation = () => {
        if (!this.state.animation) {
            this._loadAnimationAsync();
        } else {
            this.animation.reset();
            this.animation.play();
        }
    };

    renderLastSlide(index) {
        if (index === this.props.data.length - 1) {
            return (
                <Button
                    title="Onwards!"
                    raised
                    buttonStyle={styles.buttonStyle}
                    onPress={this.props.onComplete}
                />
            );
        }
    }

    renderSlides() {
        return this.props.data.map((slide, index) => {
            return (
                <View
                    key={slide.text}
                    style={[styles.slideStyle, { backgroundColor: slide.color }]}
                >
                    {slide.text ? slide.text : undefined}
                    {slide.image ? <Image
                        source={slide.image}
                        style={{ width: 155, height: 175 }}
                    />: undefined}

                    {slide.text ? <View style={styles.animationContainer}>
                        {this.state.animation &&
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 300,
                                height: 300,
                                backgroundColor: 'transparent',
                            }}
                            source={this.state.animation}
                            autoplay
                            loop
                        />}

                    </View> : undefined} 

                    {this.renderLastSlide(index)}
                </View>
            );
        });
    }

    render() {
        return (
            <ScrollView
                horizontal
                style={{ flex: 1 }}
                pagingEnabled
            >
                {this.renderSlides()}
            </ScrollView>
        );
    }
}

const styles = {
    slideStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH
    },
    textStyle: {
        fontSize: 30,
        color: 'white',
    },
    buttonStyle: {
        backgroundColor: '#0288D1',
        marginTop: 15
    },
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
};

export default Slides;






