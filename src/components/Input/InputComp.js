import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import {
  Item,
  Input,
  Label,
  Textarea,
  Text
} from 'native-base'

const width = Dimensions.get('window').width

// Reusable Input Text
export const InputText = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Item stackedLabel style={{ width: 250 }}>
        <Label style={{ color: 'white' }}>{props.label}</Label>
        <Input
          placeholder="Full name"
          placeholderTextColor="#ff85ed"
          style={{ color: 'white' }}
          autoFocus={true}
          value={props.value}
          keyboardType="default"
          onChangeText={props.handleChangeText}
        />
      </Item>
    </View>
  );
}

// Reusable Input Number
export const InputNumber = (props) => {
  return (
    <View>
      <Item style={{ width: props.inputWidth, borderBottomColor: '#e831ae' }}>
        <Label style={{ fontSize: 20, color: 'white' }}>+62</Label>
        <Input
          autoFocus={true}
          style={{ color: 'white', borderBottomColor: 'transparent', fontSize: 20, margin: 0, padding: 0 }}
          value={props.value}
          keyboardType="phone-pad"
          onChangeText={props.handleChangeText}
        />
      </Item>
    </View>
  );
}
export const InputSimple = (props) => {
  return (
    <View>
      <Input
        placeholder={props.placeholder}
        placeholderTextColor="white"
        value={props.value}
        keyboardType={props.keyboardType || "default"}
        onChangeText={props.handleChangeText}
        style={{ color: 'white', fontSize: 15, width: width * 5 / 9, borderBottomColor: 'white' }}
      />
    </View>
  );
}

export const InputWithLabel = (props) => {
  return (
    <View>
      <Item stackedLabel style={{ width: '100%' }}>
        <Label>{props.label}</Label>
        <Input
          disabled={props.disabled || false}
          placeholder={props.placeholder}
          value={props.value}
          keyboardType={props.keyboardType || "default"}
          onChangeText={props.handleChangeText}
        />
      </Item>
    </View>
  );
}

export const InputCurrency = props => {
  return (
    <TextInputMask
      type={'money'}
      keyboardType='decimal-pad'
      options={{
        precision: 0,
        separator: '',
        delimiter: '.',
        unit: 'Rp. ',
        suffixUnit: ''
      }}
      {...props}
    />
  )
}

export const FloatingInput = props => {
  let _sejajar = 15
  let _up = -15
  let _interval = 5
  let _input, inIndex, child
  const changeUpDown = _ => {
    let ukuran
    if (haveValue) {
      setTextUp(_up)
      return
    }
    if (_) {
      ukuran = _sejajar
      let interval = setInterval(() => {
        setTextUp(ukuran)
        if (ukuran <= _up)
          clearInterval(interval)
        ukuran -= _interval
      }, 1)
    } else {
      ukuran = _up
      let interval = setInterval(() => {
        setTextUp(ukuran)
        if (ukuran >= _sejajar)
          clearInterval(interval)
        ukuran += _interval
      }, 1)
    }
  }
  const renderInput = input => {
    return React.cloneElement(input, {
      onFocus: () => {
        setActiveColor('#cd0192')
        changeUpDown(true)
      },
      onBlur: () => {
        setActiveColor('grey')
        changeUpDown(false)
      }
    })
  }
  if (props.children) {
    if (Array.isArray(props.children)) {
      props.children.forEach((prop, i) => {
        if ('value' in prop.props) {
          inIndex = i
          _input = prop
        }
      })
    } else {
      _input = props.children
    }
  } else {
    throw new Error('Kasih children dong, gw mau nampilin apaan nih kalo ga lu kasih children?');
  }
  if (!('value' in _input.props)) {
    throw new Error('Tolong ya mas, Input nya di kasih value, Fungsi Input kan buat store data. Apa yang mau di store kalo ga ada value');
  } else {
    if (Array.isArray(props.children)) {
      child = []
      props.children.forEach((prop, i) => {
        if (i == inIndex) {
          child.push(renderInput(_input))
        } else {
          child.push(React.cloneElement(prop))
        }
      })
    } else {
      child = renderInput(_input)
    }
  }
  let haveValue = Array.isArray(props.children) ? child[inIndex].props.value : child.props.value
  const [activeColor, setActiveColor] = useState('grey')
  const [textUp, setTextUp] = useState(_sejajar)
  useEffect(() => {
    if (haveValue) {
      setTextUp(_up)
    }
  }, [])
  return (
    <View style={[{ position: 'relative', borderBottomWidth: 1, width: '100%', borderBottomColor: activeColor, marginTop: 5 }, props.style]}>
      <Text style={{ color: activeColor, position: 'absolute', top: textUp }}>{props.label}</Text>
      {
        Array.isArray(props.children) ? <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>{child}</View> : child
      }
    </View>
  )
}

export const FloatingInputLabelCurrency = props => {
  let _sejajar = 15
  let _up = -15
  let _interval = 5
  const [activeColor, setActiveColor] = useState('grey')
  const [textUp, setTextUp] = useState(_sejajar)
  const changeUpDown = _ => {
    let ukuran
    if (props.value) {
      setTextUp(_up)
      return
    }
    if (_) {
      ukuran = _sejajar
      let interval = setInterval(() => {
        setTextUp(ukuran)
        if (ukuran <= _up)
          clearInterval(interval)
        ukuran -= _interval
      }, 1)
    } else {
      ukuran = _up
      let interval = setInterval(() => {
        setTextUp(ukuran)
        if (ukuran >= _sejajar)
          clearInterval(interval)
        ukuran += _interval
      }, 1)
    }
  }
  useEffect(() => {
    if (props.value || props.value == 0) {
      setTextUp(_up)
    }
  }, [])
  return (
    <View style={{ position: 'relative', borderBottomWidth: 1, width: '100%', borderBottomColor: activeColor, marginTop: 5 }}>
      <Text style={{ color: activeColor, position: 'absolute', top: textUp }}>{props.label}</Text>
      <TextInputMask
        type={'money'}
        options={{
          precision: 0,
          separator: '',
          delimiter: '.',
          unit: 'Rp. ',
          suffixUnit: ''
        }}
        onFocus={() => {
          setActiveColor('#cd0192')
          changeUpDown(true)
        }}
        onBlur={() => {
          setActiveColor('grey')
          changeUpDown(false)
        }}
        disabled={props.disabled || false}
        value={props.value}
        onChangeText={props.handleChangeText}
      />
    </View>
  );
}

export const FloatingInputLabel = (props) => {
  const [activeColor, setActiveColor] = useState('grey')
  return (
    <View>
      <Item floatingLabel style={{ width: '100%', borderBottomColor: activeColor, marginTop: 5 }}>
        <Label style={{ color: activeColor }}>{props.label}</Label>
        <Input
          onFocus={() => setActiveColor('#cd0192')}
          onBlur={() => setActiveColor('grey')}
          disabled={props.disabled || false}
          value={props.value}
          keyboardType={props.keyboardType || "default"}
          onChangeText={props.handleChangeText}
          style={{ margin: 0, padding: 0, color: activeColor }}
        />
      </Item>
    </View>
  );
}

export const InputTextArea = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Item stackedLabel style={{ width: '100%' }}>
        <Label>{props.label}</Label>
        <Textarea
          rowSpan={4}
          disabled={props.disabled || false}
          placeholder={props.placeholder}
          placeholderTextColor="#ff85ed"
          value={props.value}
          keyboardType="default"
          onChangeText={props.handleChangeText}
        />
      </Item>
    </View>
  );
}

