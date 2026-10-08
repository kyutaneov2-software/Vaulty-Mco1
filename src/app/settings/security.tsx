import { Text } from "react-native";

import {
    Bullet,
    Paragraph,
    Section,
    StaticPage,
} from "../../components/StaticPage";
import { staticStyles as styles } from "../../styles/static.styles";

export default function SecurityScreen() {
    return (
        <StaticPage eyebrow="ACCOUNT" title="Security">
            <Section title="Two-step protection">
                <Paragraph>
                    Your Vaulty account uses time-based one-time passwords
                    (TOTP) as a second factor. You'll be asked for a 6-digit
                    code from your authenticator app every time you sign in from
                    a new device.
                </Paragraph>
            </Section>

            <Section title="Best practices">
                <Bullet>
                    Keep your recovery codes in a safe place — they're the only
                    way to reset your password if you lose access.
                </Bullet>
                <Bullet>
                    Don't share your authenticator setup with anyone.
                </Bullet>
                <Bullet>
                    Sign out from public or shared devices when you're done.
                </Bullet>
            </Section>

            <Section title="Session">
                <Paragraph>
                    Your session is stored locally on this device. If you sign
                    out, you'll be asked to enter your password and MFA code
                    again next time.
                </Paragraph>
            </Section>

            <Text style={styles.meta}>
                Password reset available from the sign-in screen
            </Text>
        </StaticPage>
    );
}
