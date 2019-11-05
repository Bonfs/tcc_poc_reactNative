import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryZoomContainer } from "victory-native";
import haversine from 'haversine';

import styles from './styles';

function Layout(props) {
  const [category, setCategory] = useState('steps');
  const [filter, setFilter] = useState('day');
  const [data, setData] = useState([]);
  const [yAxis, setYAxis] = useState(category);
  const [xAxis, setXAxis] = useState('day');
  useEffect(() => {
    const stepGraph = [];
    for(let [key, value] of Object.entries(props.activities)) {
      const activityDate = new Date(value.date);
      stepGraph.push({ day: activityDate.getDate(), steps: value.steps });
    }

    setData(stepGraph);
  }, []);

  function filterCategory(category) {
    setCategory(category);
  }
  useEffect(() => {
    // console.warn(category);
    const newGraph = [];
    for(let [key, value] of Object.entries(props.activities)) {
      const activityDate = new Date(value.date);
      const activity = { 'day': activityDate.getDate() };
      if (category === 'steps') {
        activity['steps'] = value.steps;
        newGraph.push(activity);
      } else if (category === 'duration') {
        activity['duration'] = value.duration;
        newGraph.push(activity);
      } else if (category === 'calories') {
        activity['calories'] = calcCalories(props.userInfo.weight, value.duration);
        newGraph.push(activity);
      } else if (category === 'distance') {
        activity['distance'] = calcDistance(value.locations);
        newGraph.push(activity);
      }
    }
    setYAxis(category);
    setData(newGraph);
  }, [category]);

  function calcCalories(weight, duration) {
		const durationInMinutes = duration / 60;
		const caloricSpent = (0.05 * weight) * durationInMinutes; // índice de uma caminhada leve

		return caloricSpent.toFixed(2);
  }
  
  function calcDistance(locations) {
		if (locations.length > 0) {
			let distance = 0;
			console.log(locations);
			for (let i = 0; i < locations.length-1; i++) {
				distance += haversine(locations[i], locations[i+1]);
			}
			return distance.toFixed(2);
		} else {
			return 0;
		}
	}

  /* function filterPeriod(period) {
    setFilter(period);
  }
  useEffect(() => {

  }, [filter]); */

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.graphTitle}>{xAxis.toUpperCase()} X {yAxis.toUpperCase()}</Text>
        <VictoryChart
          height={200}
          width={350}
          theme={VictoryTheme.material}
          animate={{
            duration: 1500,
            onLoad: { duration: 1000 }
          }}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              minimumZoon={{ x: 7 }}
              zoomDomain={{x: [1, 31]}
          }/>}
        >
          <VictoryBar
            name="AAAA"
            barWidth={10}
            barRatio={0.8}
            data={data}
            x={xAxis}
            y={yAxis}
          />
        </VictoryChart>
      </View>
      <View style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.btnCategory} onPress={() => filterCategory('steps')}>
            <Text style={styles.textCategory}>STEPS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCategory} onPress={() => filterCategory('duration')}>
            <Text style={styles.textCategory}>DURATION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCategory} onPress={() => filterCategory('calories')}>
            <Text style={styles.textCategory}>CALORIES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCategory} onPress={() => filterCategory('distance')}>
            <Text style={styles.textCategory}>DISTANCE</Text>
          </TouchableOpacity>
      </View>
      {/* <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.btnFilter} onPress={() => filterPeriod('day')}>
          <Text style={styles.textFilter}>D</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnFilter} onPress={() => filterPeriod('month')}>
          <Text style={styles.textFilter}>M</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnFilter} onPress={() => filterPeriod('year')}>
          <Text style={styles.textFilter}>Y</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

Layout.propTypes = {
  activities: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default Layout;
