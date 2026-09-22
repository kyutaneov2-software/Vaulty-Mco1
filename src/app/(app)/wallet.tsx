import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { colors, radius, spacing } from '../../constants/theme';
import { mockTransactions } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const amounts = [100, 250, 500, 1000];

export default function WalletScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.points ?? 0);

  const topUp = (amount: number) => {
    setBalance((value) => value + amount);
    Alert.alert('Demo top-up', `${amount} points were added locally. Payment integration comes later.`);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>SRV Wallet</Text>
      <Text style={styles.subtitle}>Points are the rental currency in the first UI prototype.</Text>

      <View style={styles.balanceCard}>
        <View style={styles.walletIcon}><Ionicons name="flash" size={22} color={colors.primary} /></View>
        <Text style={styles.balanceLabel}>Available points</Text>
        <Text style={styles.balance}>{balance.toLocaleString()} pts</Text>
        <Text style={styles.balanceHint}>Use points to reserve a vault by time.</Text>
      </View>

      <Text style={styles.sectionTitle}>Top up points</Text>
      <View style={styles.amountGrid}>
        {amounts.map((amount) => (
          <AppButton key={amount} title={`+${amount}`} onPress={() => topUp(amount)} variant="secondary" style={styles.amountButton} />
        ))}
      </View>
      <AppButton title="Choose payment method" onPress={() => Alert.alert('Coming later', 'We will connect a payment provider during backend integration.')} variant="primary" />

      <Text style={styles.sectionTitle}>Recent activity</Text>
      <View style={styles.activityCard}>
        {mockTransactions.map((tx) => (
          <View key={tx.id} style={styles.transactionRow}>
            <View style={styles.txIcon}>
              <Ionicons name={tx.type === 'rental' ? 'cube-outline' : 'add-circle-outline'} size={20} color={tx.amount >= 0 ? colors.success : colors.primary} />
            </View>
            <View style={styles.txCopy}>
              <Text style={styles.txTitle}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={[styles.txAmount, tx.amount < 0 && styles.negative]}>{tx.amount > 0 ? '+' : ''}{tx.amount} pts</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 52, gap: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, lineHeight: 21, marginBottom: spacing.sm },
  balanceCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: 5 },
  walletIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.softBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  balanceLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  balance: { color: colors.text, fontSize: 34, fontWeight: '900' },
  balanceHint: { color: colors.muted, fontSize: 13 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: spacing.sm },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amountButton: { flexBasis: '48%', flexGrow: 1 },
  activityCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 11 },
  txIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  txCopy: { flex: 1, gap: 3 },
  txTitle: { color: colors.text, fontWeight: '700' },
  txDate: { color: colors.muted, fontSize: 12 },
  txAmount: { color: colors.success, fontWeight: '800' },
  negative: { color: colors.danger },
});
