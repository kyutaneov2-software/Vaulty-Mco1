import { View } from "react-native";

import { Skeleton } from "./Skeleton";
import { colors, radius, spacing } from "../constants/theme";
import { skStyles as styles } from "../styles/skeletons.styles";

/* =========================================================
   HOME
========================================================= */

export function HomeSkeleton() {
    return (
        <View style={styles.fill}>
            {/* Sticky header */}

            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={44} height={44} borderRadius={22} />

                    <View style={styles.headerText}>
                        <Skeleton width={90} height={12} />
                        <Skeleton
                            width={120}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>

                <View style={styles.pillRow}>
                    <Skeleton width={92} height={32} borderRadius={999} />
                </View>
            </View>

            {/* Content */}

            <View style={styles.content}>
                {/* Map card */}

                <View style={styles.card}>
                    <Skeleton width={120} height={10} />
                    <Skeleton
                        width={220}
                        height={16}
                        style={{ marginTop: 8, marginBottom: 16 }}
                    />

                    <Skeleton height={180} borderRadius={16} />

                    <Skeleton
                        height={46}
                        borderRadius={16}
                        style={{ marginTop: 16 }}
                    />
                </View>

                {/* Nearby — section title + 2 rows */}

                <Skeleton width={80} height={16} />

                <NearbyRowSkeleton />
                <NearbyRowSkeleton />

                {/* Your rental */}

                <Skeleton width={110} height={16} />
                <RentalRowSkeleton />

                {/* How it works */}

                <Skeleton width={100} height={16} />
                <Skeleton height={90} borderRadius={22} />
            </View>
        </View>
    );
}

function NearbyRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={64} height={64} borderRadius={12} />

            <View style={styles.rowBody}>
                <Skeleton width={60} height={14} />
                <Skeleton width={50} height={11} style={{ marginTop: 6 }} />
                <Skeleton width={130} height={11} style={{ marginTop: 6 }} />
            </View>

            <View style={styles.rowRight}>
                <Skeleton width={40} height={16} />
                <Skeleton width={24} height={10} style={{ marginTop: 4 }} />
            </View>
        </View>
    );
}

function RentalRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={46} height={46} borderRadius={14} />

            <View style={styles.rowBody}>
                <Skeleton width={140} height={13} />
                <Skeleton width={90} height={11} style={{ marginTop: 6 }} />
            </View>
        </View>
    );
}

/* =========================================================
   RENTALS
========================================================= */

export function RentalsSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <View style={styles.headerText}>
                        <Skeleton width={80} height={10} />
                        <Skeleton
                            width={140}
                            height={20}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>

                <View style={styles.chipRow}>
                    <Skeleton width={60} height={34} borderRadius={999} />
                    <Skeleton width={72} height={34} borderRadius={999} />
                    <Skeleton width={82} height={34} borderRadius={999} />
                </View>
            </View>

            <View style={styles.content}>
                <Skeleton width={80} height={12} />

                <View style={styles.group}>
                    <RentalHistoryRowSkeleton />
                    <View style={styles.divider} />
                    <RentalHistoryRowSkeleton />
                </View>

                <Skeleton width={80} height={12} style={{ marginTop: 8 }} />

                <View style={styles.group}>
                    <RentalHistoryRowSkeleton />
                    <View style={styles.divider} />
                    <RentalHistoryRowSkeleton />
                    <View style={styles.divider} />
                    <RentalHistoryRowSkeleton />
                </View>
            </View>
        </View>
    );
}

function RentalHistoryRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={38} height={38} borderRadius={12} />

            <View style={styles.rowBody}>
                <Skeleton width={70} height={13} />
                <Skeleton width={120} height={11} style={{ marginTop: 5 }} />
            </View>

            <View style={styles.rowRight}>
                <Skeleton width={40} height={14} />
                <Skeleton
                    width={54}
                    height={16}
                    borderRadius={999}
                    style={{ marginTop: 5 }}
                />
            </View>
        </View>
    );
}

/* =========================================================
   WALLET
========================================================= */

export function WalletSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={90} height={10} />
                        <Skeleton
                            width={70}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>
            </View>

            <View style={styles.content}>
                {/* Balance card */}

                <View style={styles.card}>
                    <View style={styles.balanceTop}>
                        <Skeleton width={34} height={34} borderRadius={11} />
                        <Skeleton width={130} height={12} />
                    </View>

                    <Skeleton
                        width={180}
                        height={54}
                        borderRadius={12}
                        style={{ marginTop: 20 }}
                    />

                    <Skeleton
                        width={100}
                        height={11}
                        style={{ marginTop: 8 }}
                    />
                </View>

                {/* Quick top up */}

                <Skeleton width={100} height={14} />

                <View style={styles.topUpRow}>
                    <Skeleton width={88} height={62} borderRadius={16} />
                    <Skeleton width={88} height={62} borderRadius={16} />
                    <Skeleton width={88} height={62} borderRadius={16} />
                </View>

                {/* Pay with card */}

                <Skeleton width={110} height={14} />
                <Skeleton height={72} borderRadius={22} />

                {/* Recent activity */}

                <Skeleton width={130} height={14} />
                <View style={styles.group}>
                    <WalletRowSkeleton />
                    <View style={styles.divider} />
                    <WalletRowSkeleton />
                </View>
            </View>
        </View>
    );
}

function WalletRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={38} height={38} borderRadius={12} />

            <View style={styles.rowBody}>
                <Skeleton width={140} height={13} />
            </View>

            <Skeleton width={50} height={14} />
        </View>
    );
}

/* =========================================================
   VAULTS BROWSE
========================================================= */

export function VaultsSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={80} height={10} />
                        <Skeleton
                            width={140}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>
            </View>

            <View style={styles.content}>
                <Skeleton height={220} borderRadius={22} />

                <View style={styles.chipRow}>
                    <Skeleton width={60} height={34} borderRadius={999} />
                    <Skeleton width={72} height={34} borderRadius={999} />
                    <Skeleton width={90} height={34} borderRadius={999} />
                </View>

                <VaultRowSkeleton />
                <VaultRowSkeleton />
            </View>
        </View>
    );
}

function VaultRowSkeleton() {
    return (
        <View style={[styles.row, styles.rowTall]}>
            <Skeleton width={74} height={74} borderRadius={12} />

            <View style={styles.rowBody}>
                <Skeleton width={60} height={15} />
                <Skeleton width={140} height={12} style={{ marginTop: 6 }} />
                <Skeleton width={90} height={11} style={{ marginTop: 6 }} />
                <Skeleton width={50} height={14} style={{ marginTop: 8 }} />
            </View>

            <Skeleton width={16} height={16} borderRadius={8} />
        </View>
    );
}

/* =========================================================
   VAULT DETAIL
========================================================= */

export function DetailSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={40} height={10} />
                        <Skeleton
                            width={100}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>
            </View>

            <View style={styles.content}>
                <Skeleton height={220} borderRadius={22} />

                <Skeleton width={120} height={30} borderRadius={8} />
                <Skeleton width={180} height={14} />

                <Skeleton height={72} borderRadius={22} />

                <Skeleton width={130} height={16} />
                <Skeleton height={56} borderRadius={16} />
                <Skeleton height={56} borderRadius={16} />
                <Skeleton height={56} borderRadius={16} />

                <Skeleton width={100} height={16} />
                <Skeleton height={72} borderRadius={22} />
            </View>
        </View>
    );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export function NotificationsSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={90} height={10} />
                        <Skeleton
                            width={150}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Skeleton width={70} height={12} />

                <View style={styles.group}>
                    <NotificationRowSkeleton />
                    <View style={styles.divider} />
                    <NotificationRowSkeleton />
                    <View style={styles.divider} />
                    <NotificationRowSkeleton />
                </View>
            </View>
        </View>
    );
}

function NotificationRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={40} height={40} borderRadius={13} />

            <View style={styles.rowBody}>
                <Skeleton width={140} height={13} />
                <Skeleton width={180} height={11} style={{ marginTop: 6 }} />
                <Skeleton width={60} height={10} style={{ marginTop: 6 }} />
            </View>

            <Skeleton width={40} height={14} />
        </View>
    );
}

/* =========================================================
   ACTIVE RENTAL
========================================================= */

export function ActiveSkeleton() {
    return (
        <View style={styles.fill}>
            {/* Header */}

            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={100} height={10} />
                        <Skeleton
                            width={80}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <Skeleton width={42} height={42} borderRadius={14} />
                </View>
            </View>

            <View style={styles.content}>
                {/* Hero lock card */}

                <View style={styles.heroSkeleton}>
                    <Skeleton width={100} height={100} borderRadius={50} />
                    <Skeleton
                        width={120}
                        height={22}
                        style={{ marginTop: 16 }}
                    />
                    <Skeleton
                        width={160}
                        height={40}
                        style={{ marginTop: 12 }}
                    />
                    <Skeleton
                        width={100}
                        height={11}
                        style={{ marginTop: 8 }}
                    />
                    <Skeleton
                        height={5}
                        borderRadius={3}
                        style={{ marginTop: 20, width: "100%" }}
                    />
                </View>

                {/* Action button */}

                <Skeleton height={58} borderRadius={16} />

                {/* Device status */}

                <Skeleton width={70} height={12} />

                <View style={styles.deviceRow}>
                    <View style={styles.deviceItem}>
                        <Skeleton
                            width={14}
                            height={14}
                            borderRadius={7}
                        />
                        <Skeleton
                            width={60}
                            height={10}
                            style={{ marginTop: 8 }}
                        />
                        <Skeleton
                            width={50}
                            height={13}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <View style={styles.deviceDivider} />

                    <View style={styles.deviceItem}>
                        <Skeleton
                            width={16}
                            height={16}
                            borderRadius={4}
                        />
                        <Skeleton
                            width={50}
                            height={10}
                            style={{ marginTop: 8 }}
                        />
                        <Skeleton
                            width={40}
                            height={13}
                            style={{ marginTop: 6 }}
                        />
                    </View>

                    <View style={styles.deviceDivider} />

                    <View style={styles.deviceItem}>
                        <Skeleton
                            width={16}
                            height={16}
                            borderRadius={4}
                        />
                        <Skeleton
                            width={50}
                            height={10}
                            style={{ marginTop: 8 }}
                        />
                        <Skeleton
                            width={60}
                            height={13}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                </View>

                {/* Rental info */}

                <Skeleton width={80} height={12} />

                <View style={styles.group}>
                    <InfoRowSkeleton />
                    <View style={styles.divider} />
                    <InfoRowSkeleton />
                    <View style={styles.divider} />
                    <InfoRowSkeleton />
                    <View style={styles.divider} />
                    <InfoRowSkeleton />
                </View>

                {/* Activity log */}

                <Skeleton width={80} height={12} />

                <View style={styles.group}>
                    <ActivityRowSkeleton />
                    <View style={styles.divider} />
                    <ActivityRowSkeleton />
                </View>
            </View>
        </View>
    );
}

function InfoRowSkeleton() {
    return (
        <View style={styles.infoRow}>
            <Skeleton width={70} height={13} />
            <Skeleton width={100} height={13} />
        </View>
    );
}

function ActivityRowSkeleton() {
    return (
        <View style={styles.row}>
            <Skeleton width={34} height={34} borderRadius={11} />

            <View style={styles.rowBody}>
                <Skeleton width={80} height={14} />
            </View>

            <Skeleton width={40} height={12} />
        </View>
    );
}

/* =========================================================
   RENT SCREEN
========================================================= */

export function RentSkeleton() {
    return (
        <View style={styles.fill}>
            <View style={styles.stickyHeader}>
                <View style={styles.headerRow}>
                    <Skeleton width={42} height={42} borderRadius={14} />

                    <View style={styles.headerText}>
                        <Skeleton width={80} height={10} />
                        <Skeleton
                            width={150}
                            height={18}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Vault preview */}

                <View style={styles.rowTall}>
                    <Skeleton width={64} height={64} borderRadius={12} />

                    <View style={styles.rowBody}>
                        <Skeleton width={60} height={17} />
                        <Skeleton
                            width={140}
                            height={12}
                            style={{ marginTop: 6 }}
                        />
                        <Skeleton
                            width={70}
                            height={11}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                </View>

                {/* Duration picker */}

                <Skeleton width={80} height={12} />

                <View style={styles.chipRow}>
                    <Skeleton
                        height={88}
                        borderRadius={16}
                        style={{ flex: 1 }}
                    />
                    <Skeleton
                        height={88}
                        borderRadius={16}
                        style={{ flex: 1 }}
                    />
                    <Skeleton
                        height={88}
                        borderRadius={16}
                        style={{ flex: 1 }}
                    />
                </View>

                {/* Summary */}

                <Skeleton width={90} height={12} />

                <View style={styles.card}>
                    <Skeleton height={14} />
                    <Skeleton
                        height={14}
                        style={{ marginTop: 12 }}
                    />
                    <Skeleton
                        height={1}
                        style={{ marginTop: 16, marginBottom: 16 }}
                    />
                    <Skeleton height={20} />
                    <Skeleton
                        height={38}
                        borderRadius={10}
                        style={{ marginTop: 16 }}
                    />
                    <Skeleton
                        height={14}
                        style={{ marginTop: 12 }}
                    />
                </View>
            </View>
        </View>
    );
}
