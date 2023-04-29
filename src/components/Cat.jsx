/**
 * TODO fill this part
 * @format
 */

import React, { Component } from "react";
import { Button, Text, TextInput, View } from 'react-native';

type CatProps = {
    name: String;
};

class Cat extends Component<CatProps> {
    state = {isHungry: true};
    render() {
        return ( 
            <View>
                <Text>Hello, I am {this.props.name}, and I am {this.state.isHungry ? 'hungry' : 'full'} ! </Text>
                <Button
                    onPress={() => {
                        this.setState({isHungry: false});
                    }}
                    disabled={!this.state.isHungry}
                    title={
                        this.state.isHungry ? 'Pour me some milk, please !': 'Thank you !'
                    }
                />
            </View>
    );
    }
}

export default Cat;