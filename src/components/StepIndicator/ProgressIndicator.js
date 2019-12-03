import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import StepIndicator from './StepIndicator';
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';


const height = Dimensions.get('window').height
const ProgressIndicator = (props) => {
    return (
        <View style={{ height: height * 0.08, ...RowChild, justifyContent: "center" }}>
            <Text style={{ fontFamily: FontList.primaryFont, marginRight: 5 }}>Langkah</Text>
            {[<View style={styles.stepIcons}>
                <StepIndicator
                    key={1}
                    stepNum={1}
                    isCompletedStep={props.firstIsCompleteStep}
                    isActiveStep={props.firstIsActiveStep}
                />
                <View style={styles.divider}>
                    <View style={[styles.hrLine, props.firstSeparator ?null : {backgroundColor : 'grey'} ]} />
                </View>
                <StepIndicator
                    key={2}
                    stepNum={2}
                    isCompletedStep={props.secondIsCompleteStep}
                    isActiveStep={props.falsecondIsActiveStepse}
                />
                <View style={styles.divider}>
                    <View style={[styles.hrLine, props.secondSeparator ?null : {backgroundColor : 'grey'} ]} />
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
    lowerSection: {
      width : "100%",
      height : '80%',
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'transparent',
      justifyContent : 'space-between'
    },
    camera: {
      marginTop : height * 0.05,
      height: height * 0.7,
      alignItems: "flex-start",
    },
    stepIcons: {
      position: 'relative',
      justifyContent: 'space-evenly',
      alignSelf: 'center',
      alignItems : 'center',
      flexDirection: 'row',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal : 10
    },
    hrLine: {
      width: 30,
      backgroundColor: '#cd0192',
      height: 5,
    },
  });