import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { colors, radius, spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() ?? 'S'}</Text></View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.optionCard}>
        <View style={styles.optionRow}><Ionicons name="shield-checkmark-outline" size={21} color={colors.primary} /><Text style={styles.optionText}>Account & security</Text></View>
        <View style={styles.optionRow}><Ionicons name="notifications-outline" size={21} color={colors.primary} /><Text style={styles.optionText}>Notifications</Text></View>
        <View style={styles.optionRow}><Ionicons name="help-circle-outline" size={21} color={colors.primary} /><Text style={styles.optionText}>Help & support</Text></View>
      </View>

      <AppButton title="Log out" variant="secondary" onPress={() => Alert.alert('Log out', 'End the current demo session?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: signOut },
      ])} />

      <Text style={styles.version}>SRV UI foundation · v0.1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 52, gap: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', padding: spacing.lg, gap: 5 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.softBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  avatarText: { color: colors.primary, fontSize: 28, fontWeight: '900' },
  name: { color: colors.text, fontWeight: '800', fontSize: 20 },
  email: { color: colors.muted },
  optionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionText: { color: colors.text, fontWeight: '700' },
  version: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 'auto' },
});
