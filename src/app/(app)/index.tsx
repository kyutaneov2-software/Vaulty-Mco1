import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { colors, radius, spacing } from '../../constants/theme';
import { mockVaults } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const featuredVault = mockVaults[0];

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name ?? 'SRV User'}</Text>
          <Text style={styles.subtitle}>Find a vault nearby.</Text>
        </View>
        <View style={styles.pointsPill}>
          <Ionicons name="flash" size={16} color={colors.primary} />
          <Text style={styles.pointsText}>{user?.points ?? 0} pts</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="cube-outline" size={30} color={colors.primary} /></View>
        <Text style={styles.heroTitle}>Store small. Move smart.</Text>
        <Text style={styles.heroText}>Rent a nearby SRV vault for exactly the time you need.</Text>
        <AppButton title="Browse nearby vaults" onPress={() => undefined} style={styles.heroButton} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby vaults</Text>
        <Text style={styles.sectionLink}>View all</Text>
      </View>

      <View style={styles.vaultCard}>
        <View style={styles.vaultTopRow}>
          <View style={styles.vaultIcon}><Ionicons name="cube-outline" size={22} color={colors.primary} /></View>
          <View style={styles.availableBadge}><View style={styles.dot} /><Text style={styles.availableText}>Available</Text></View>
        </View>
        <Text style={styles.vaultName}>{featuredVault.name}</Text>
        <Text style={styles.vaultAddress}>{featuredVault.address} · {featuredVault.distance}</Text>
        <View style={styles.vaultMetaRow}>
          <Text style={styles.vaultMeta}>{featuredVault.size}</Text>
          <Text style={styles.price}><Text style={styles.priceStrong}>{featuredVault.pricePerHour}</Text> pts/hr</Text>
        </View>
        <AppButton title="Reserve" onPress={() => undefined} style={styles.reserveButton} />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.success} />
        <View style={styles.infoCopy}>
          <Text style={styles.infoTitle}>Your vault, your session</Text>
          <Text style={styles.infoText}>In the backend phase, the ESP32 lock will be paired to the reservation and time window.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 52, gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: 4, fontSize: 15 },
  pointsPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.softBlue, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.pill },
  pointsText: { color: colors.primary, fontWeight: '800' },
  hero: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  heroIcon: { width: 54, height: 54, borderRadius: 17, backgroundColor: colors.softBlue, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.text, fontSize: 23, fontWeight: '800', marginTop: 4 },
  heroText: { color: colors.muted, lineHeight: 22, fontSize: 15 },
  heroButton: { marginTop: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionLink: { color: colors.primary, fontWeight: '700' },
  vaultCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  vaultTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vaultIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.softBlue, alignItems: 'center', justifyContent: 'center' },
  availableBadge: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.softGreen, paddingVertical: 7, paddingHorizontal: 10, borderRadius: radius.pill },
  dot: { width: 7, height: 7, borderRadius: 7, backgroundColor: colors.success },
  availableText: { color: colors.success, fontSize: 12, fontWeight: '800' },
  vaultName: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 4 },
  vaultAddress: { color: colors.muted, fontSize: 14 },
  vaultMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  vaultMeta: { color: colors.muted, fontWeight: '600' },
  price: { color: colors.muted },
  priceStrong: { color: colors.text, fontSize: 19, fontWeight: '800' },
  reserveButton: { marginTop: spacing.sm },
  infoCard: { flexDirection: 'row', gap: 12, backgroundColor: colors.softGreen, borderRadius: radius.md, padding: spacing.md },
  infoCopy: { flex: 1, gap: 3 },
  infoTitle: { color: colors.text, fontWeight: '800' },
  infoText: { color: colors.muted, lineHeight: 20, fontSize: 13 },
});
