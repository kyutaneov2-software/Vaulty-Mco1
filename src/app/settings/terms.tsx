import { Text } from "react-native";

import {
    Bullet,
    Paragraph,
    Section,
    StaticPage,
} from "../../components/StaticPage";
import { staticStyles as styles } from "../../styles/static.styles";

export default function TermsScreen() {
    return (
        <StaticPage eyebrow="LEGAL" title="Terms & conditions">
            <Section title="Acceptance of terms">
                <Paragraph>
                    By creating a Vaulty account and using the application, you
                    agree to these terms. If you do not agree, please do not use
                    the service.
                </Paragraph>
            </Section>

            <Section title="Account responsibility">
                <Bullet>
                    You are responsible for maintaining the security of your
                    account credentials.
                </Bullet>
                <Bullet>You must not share your account with others.</Bullet>
                <Bullet>You must keep your MFA authenticator secure.</Bullet>
            </Section>

            <Section title="Vault rental">
                <Bullet>
                    Rentals are time-boxed. Access expires at the end of your
                    rental period.
                </Bullet>
                <Bullet>
                    Points deducted for a rental are non-refundable except where
                    required by law.
                </Bullet>
                <Bullet>
                    Do not store illegal, dangerous, or perishable items in a
                    vault.
                </Bullet>
            </Section>

            <Section title="Limitation of liability">
                <Paragraph>
                    Vaulty is not liable for loss or damage to items stored in a
                    vault, except where caused by our negligence. You use the
                    service at your own risk.
                </Paragraph>
            </Section>

            <Text style={styles.meta}>Last updated: 2026</Text>
        </StaticPage>
    );
}
