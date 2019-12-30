import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Wrapper } from '../Button/ButtonComp';
import { TextInput } from 'react-native-gesture-handler';

export const CodeInput = props => {
	const [index, setIndex] = useState(0)
	const [length, setLength] = useState([])
	const [refs, setRefs] = useState([])
	const _press = i => {
		setIndex(i)
		refs[index].focus()
		console.debug(refs[index])
	}
	useEffect(() => {
		setLength(Array.from(Array(props.codeLength).keys()))
		setRefs([])
	}, [])
	return <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
		<Wrapper>
			{props.codeLength ?
				length.map((_, i) => {
					return <TextInput secureTextEntry ref={ref => refs.push(ref)} value="8" maxLength={1} style={styles.input} />
				})
				:
				null
			}
		</Wrapper>
	</View>
}

const styles = StyleSheet.create({
	input: { fontSize: 35, paddingHorizontal: 15, marginRight: 5, borderWidth: 1, justifyContent: 'flex-end', padding: 0, width: 40, height: 40 }
})

{/* <CodeInputCustom
	keyboardType="numeric"
	activeColor='black'
	inactiveColor='grey'
	codeLength={4}
	size={40}
	autoFocus
	onFulfill={(code) => _handleOTPFulfilled(code)}
/> */}