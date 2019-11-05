import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(8),
    backgroundColor: '#e0e0e0'
  },
  emptyText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: scale(32)
  }
});

export default styles;
