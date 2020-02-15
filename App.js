/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';




const AppComponent = ({ moods, onPress }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              {moods.map(m => <Text key={m.created_at}>{m.created_at} / {m.mood}</Text>)}
            </View>
            <View style={styles.sectionContainer}>
              {[1,2,3,4,5,6,7].map(i => <Button key={i} title={`${i}`} onPress={() => onPress(i)}/>)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moods: []
    };

    this.postMood = this.postMood.bind(this)
  }

  async componentDidMount() {
    const fetchMoods = async () => await fetch('http://localhost:3000/moods/').then(res => res.json())
    const moods = await fetchMoods()
    this.setState({moods})
  }

  async postMood(moodStatus) {
    const newMood = await fetch('http://localhost:3000/moods/', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: {
          mood: moodStatus
        }
      })
    }).then(res => res.json())
    this.setState({ moods: [...this.state.moods, newMood]})
  }

  render() {
    return <AppComponent moods={this.state.moods} onPress={this.postMood}/>
  }
}


export default App;
