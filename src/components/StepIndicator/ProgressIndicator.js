import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import StepIndicator from './StepIndicator';
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';


const height = Dimensions.get('window').height
const ProgressIndicator = (props) => {
  return (
    <View style={styles.progressContainer}>
      <Text style={}>Langkah</Text>
      {[<View style={styles.stepIcons}>
        <StepIndicator
          key={1}
          stepNum={1}
          isCompletedStep={props.firstIsCompleteStep}
          isActiveStep={props.firstIsActiveStep}
        />
        <View style={styles.divider}>
          <View style={[styles.hrLine, props.firstSeparator ? null : { backgroundColor: 'grey' }]} />
        </View>
        <StepIndicator
          key={2}
          stepNum={2}
          isCompletedStep={props.secondIsCompleteStep}
          isActiveStep={props.falsecondIsActiveStepse}
        />
        <View style={styles.divider}>
          <View style={[styles.hrLine, props.secondSeparator ? null : { backgroundColor: 'grey' }]} />
        </View>
        <StepIndicator
          stepNum={3}
          key={3}
          isLastStep
          isCompletedStep={props.thirdIsCompleteStep}
          isActiveStep={props.thirdIsActiveStep}
        />
      </View>
      ]}
    </View>
  )
}

export default ProgressIndicator

const styles = StyleSheet.create({
  progressContainer: {
    height: height * 0.08,
    ...RowChild,
    justifyContent: "center"
  },
  fontStyle: {
    fontFamily: 'Nunito-SemiBold',
    marginRight: 10,
    fontSize: 18,
    color: 'grey'
  },
  stepIcons: {
    position: 'relative',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  hrLine: {
    width: 40,
    backgroundColor: '#cd0192',
    height: 3,
  },
});