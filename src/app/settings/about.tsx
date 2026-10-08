import { Text } from "react-native";

import {
    Bullet,
    Paragraph,
    Section,
    StaticPage,
} from "../../components/StaticPage";
import { staticStyles as styles } from "../../styles/static.styles";

export default function AboutScreen() {
    return (
        <StaticPage eyebrow="ABOUT" title="About Vaulty">
            <Section title="What is Vaulty?">
                <Paragraph>
                    Vaulty is a smart physical-vault rental platform. Users
                    browse available vaults, rent them for a chosen duration,
                    and unlock the physical device through the app.
                </Paragraph>
            </Section>

            <Section title="How it works">
                <Bullet>Browse vaults near you on the map.</Bullet>
                <Bullet>Pick a rental duration that fits your need.</Bullet>
                <Bullet>Pay from your Vaulty wallet.</Bullet>
                <Bullet>
                    Unlock the vault from your phone when you arrive.
                </Bullet>
            </Section>

            <Section title="Built for">
                <Paragraph>
                    Vaulty is a student project developed for MCO1. It combines
                    a mobile application with a physical ESP32-based lock
                    controller to demonstrate a real end-to-end rental flow.
                </Paragraph>
            </Section>

            <Text style={styles.meta}>Vaulty Mobile • v1.0.0</Text>
        </StaticPage>
    );
}
