import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  Alert,
  Pressable,
  Text,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';

const {height, width} = Dimensions.get('window');

export default () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[][]>([]);

  //ref for snapshot
  const ref = useRef<ViewShot>(null);

  const onTouchMove = (event: GestureResponderEvent) => {
    const newPath = [...currentPath];

    //get current user touches position
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;

    // create new point
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(
      0,
    )},${locationY.toFixed(0)} `;

    // add the point to older points
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const onTouchEnd = () => {
    const currentPaths = [...paths];
    const newPath = [...currentPath];

    //push new path with old path and clean current path state
    currentPaths.push(newPath);
    setPaths(currentPaths);
    setCurrentPath([]);
  };

  const save = () => {
    captureRef(ref, {
      format: 'jpg',
      quality: 0.8,
    }).then(
      uri => Alert.alert('file saved in', uri),
      error => console.error('Oops, snapshot failed', error),
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.svgContainer}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        <ViewShot
          ref={ref}
          options={{
            format: 'jpg',
            quality: 1,
          }}>
          <Svg height={height * 0.7} width={width}>
            <Path
              d={currentPath.join('')}
              stroke={'red'}
              fill={'transparent'}
              strokeWidth={2}
            />

            {paths.length > 0 &&
              paths.map((item, index) => (
                <Path
                  key={`path-${index}`}
                  d={item.join('')}
                  stroke={'red'}
                  strokeWidth={2}
                  fill={'transparent'}
                />
              ))}
          </Svg>
        </ViewShot>
      </View>
      <Pressable style={styles.saveButton} onPress={save}>
        <Text>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    height: height * 0.7,
    width,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  saveButton: {
    height: 40,
    width: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
