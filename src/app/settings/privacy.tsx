import { Text } from "react-native";

import {
    Bullet,
    Paragraph,
    Section,
    StaticPage,
} from "../../components/StaticPage";
import { staticStyles as styles } from "../../styles/static.styles";

export default function PrivacyScreen() {
    return (
        <StaticPage eyebrow="LEGAL" title="Privacy policy">
            <Section title="What we collect">
                <Bullet>Your name and email address.</Bullet>
                <Bullet>Your profile photo (if you upload one).</Bullet>
                <Bullet>Rental history and wallet transactions.</Bullet>
                <Bullet>Approximate location (only when using the map).</Bullet>
            </Section>

            <Section title="How we use it">
                <Paragraph>
                    Your data is used to operate the rental service — creating
                    your account, processing rentals, and showing your activity.
                    We do not sell your information to third parties.
                </Paragraph>
            </Section>

            <Section title="Storage">
                <Paragraph>
                    Account data, rental records, and wallet transactions are
                    stored securely via Supabase. Authentication uses MFA. Your
                    session is stored locally on your device using encrypted
                    storage.
                </Paragraph>
            </Section>

            <Section title="Your rights">
                <Bullet>You can edit your profile at any time.</Bullet>
                <Bullet>
                    You can request deletion of your account by contacting
                    support.
                </Bullet>
            </Section>

            <Text style={styles.meta}>Last updated: 2026</Text>
        </StaticPage>
    );
}
