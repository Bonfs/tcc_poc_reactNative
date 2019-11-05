import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '../../../../theme/colors';

export default  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  chartContainer: {
    flex: 1,
    marginLeft: scale(12),
    alignContent: 'center'
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnCategory: {
    flex: 3,
    width: '33%',
    height: verticalScale(72),
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: scale(1),
    borderColor: colors.primaryColor,
  },
  textCategory: {
    alignSelf: 'center',
    color: colors.primaryVariantColor,
    fontSize: scale(16)
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnFilter: {
    justifyContent: 'center',
    alignContent: 'center',
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    borderWidth: scale(1),
    borderColor: colors.secondaryColor,
  },
  textFilter: {
    alignSelf: 'center',
    color: colors.secondaryVariantColor,
    fontSize: scale(20)
  },
  graphTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: scale(24),
    color: '#353535',
    marginTop: verticalScale(12),
  },
});
