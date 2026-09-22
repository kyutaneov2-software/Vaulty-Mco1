import { StyleSheet, View } from "react-native";

import SRVBackground from "../../components/SRVBackground";

export default function WalletScreen() {
    return (
        <SRVBackground>
            <View style={styles.container} />
        </SRVBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
