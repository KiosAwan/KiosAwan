import { MyModal } from "../Picker/SelectBoxModal";

const PilihPelanggan = (props) => {
	return (
		<View>
			<MyModal visible={props.visible}
				body={
					<Text>Test</Text>
				}
				backdropDismiss={false}
			/>
		</View>
	)
}