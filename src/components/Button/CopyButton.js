import React from 'react';
import { Button } from './Button';
import { Image } from '../CustomImage';
import { Text } from '../Text/CustomText';
import PropTypes from 'prop-types'
export const CopyButton = ({ onPress, style }) => {
    return <Button style={style} padding={5} noBorder color="transparent" width={65} onPress={onPress}>
        <Image source={require("src/assets/icons/copy.png")} size={15} />
        <Text size={12} color="primary" font="SemiBold">COPY</Text>
    </Button>
}

CopyButton.propTypes = {
    onPress: PropTypes.func
}