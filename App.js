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
} from 'react-native';

import { Button } from 'react-native-elements';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NativeRouter, Route, Link, useHistory } from "react-router-native";
import moment from 'moment';
import {
  LineChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const MoodChart = ({ moods = [] }) => {
  const labels = moods.map(m => moment(m.created_at).format("HH:mm"));
  const moodData = moods.map(m => m.mood);

  return <LineChart
    data={{
      labels: labels,
      datasets: [{
        data: moodData
      }],
    }}
    width={screenWidth}
    height={256}
    verticalLabelRotation={30}
    chartConfig={{
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = .7) => `rgba(25, 0, 120, ${opacity})`,
      barPercentage: 0.5
    }}
    bezier
  />
}

const MoodHistory = ({moods}) => <View style={styles.moodHistory}>
  <Text style={styles.sectionTitle}>Mood history</Text>
  {moods.length > 0 ? <MoodChart moods={moods.slice(moods.length - 7)} /> : <></>}
</View>

const TrackMood = ({ onPress }) => {
  let history = useHistory();
  return <View style={styles.trackMood}>
    <Text style={styles.sectionTitle}>How're you feeling today?</Text>
    <View style={styles.options}>{[1,2,3,4,5,6,7].map(i => <Button key={i} title={`${i}`} onPress={() => onPress(i, history)}/>)}</View>
  </View>
}

const Nav = () => {
  let history = useHistory();
  return <View style={styles.nav}>
    <Button onPress={() => history.push('/')} title="track"/>
    <Button onPress={() => history.push('/history')} title="history"/>
  </View>
}

const AppComponent = ({ moods, onPress }) => {
  return (
    <NativeRouter>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Route exact path="/" render={() => <TrackMood onPress={onPress} />} />
            <Route exact path="/history" render={() => <MoodHistory moods={moods} />} />
          </View>
        </ScrollView>
        <Nav />
      </SafeAreaView>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  options: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    color: '#000000'
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.white,
    paddingBottom: '10%'
  },
  navButton: {
    borderWidth: 1,
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: '20%',
    color: Colors.black,
  },
  scrollView: {
    height: '90%',
    margin: "5%",
    paddingTop: '20%',
  },
  moodHistory: {
  }
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

  async postMood(moodStatus, history) {
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
    history.push('/history')
  }

  render() {
    return <AppComponent moods={this.state.moods} onPress={this.postMood}/>
  }
}




export default App;
