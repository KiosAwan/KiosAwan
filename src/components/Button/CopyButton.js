import React from 'react';
import { Button } from './Button';
import { Image } from '../CustomImage';
import { Text } from '../Text/CustomText';
export const CopyButton = (props) => {
    return <Button padding={5} noBorder color="transparent" width={80} onPress={props.onPress}>
        <Image source={require("src/assets/icons/copy.png")} size={15} />
        <Text size={12}>Copy</Text>
    </Button>
}