import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SideMenu() {
    const router = useRouter();

    const menuItems = [
        { icon: 'home', label: 'Home', route: '/(tabs)/home', type: 'ionicons' },
        { icon: 'folder-open', label: 'My Records', route: '/(tabs)/records', type: 'ionicons' },
        { icon: 'book', label: 'Breed Library', route: '/(stack)/breed-library', type: 'ionicons' },
        { icon: 'link-variant', label: 'BPA Integration', route: '/(auth)/bpa-login', type: 'material' },
    ];

    const bottomItems = [
        { icon: 'settings', label: 'Settings', route: '/(stack)/settings', type: 'ionicons' },
        { icon: 'help-circle', label: 'Help & Support', route: '/(stack)/help', type: 'ionicons' },
        { icon: 'information-circle', label: 'About', route: '/(stack)/about', type: 'ionicons' },
    ];

    const renderMenuItem = (item: any, index: number) => (
        <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
                if (item.route) router.push(item.route as any);
            }}
        >
            <View style={styles.menuIconBox}>
                {item.type === 'ionicons' ? (
                    <Ionicons name={item.icon as any} size={22} color="#1B4332" />
                ) : (
                    <MaterialCommunityIcons name={item.icon as any} size={22} color="#1B4332" />
                )}
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SafeAreaView edges={['top']} style={styles.safeHeader}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.profileSection}>
                        <View style={styles.avatarBorder}>
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Rajesh Kumar</Text>
                            <Text style={styles.userRole}>Field Officer</Text>
                        </View>
                    </View>

                    <View style={styles.cardInfo}>
                        <View>
                            <Text style={styles.cardLabel}>Officer ID</Text>
                            <Text style={styles.cardValue}>OF-2847</Text>
                        </View>
                        <MaterialCommunityIcons name="card-account-details-outline" size={30} color="#FFF" style={{ opacity: 0.9 }} />
                    </View>
                </SafeAreaView>
            </View>

            <View style={styles.menuContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.section}>
                        {menuItems.map(renderMenuItem)}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        {bottomItems.map(renderMenuItem)}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/(auth)/login')}>
                        <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Version 1.2.0</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B4332', // Background color behind radius
    },
    headerContainer: {
        backgroundColor: '#1B4332', // Dark Green
        paddingBottom: 24,
    },
    safeHeader: {
        paddingHorizontal: 24,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 8,
        marginTop: 10,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    avatarBorder: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 2,
        borderColor: '#4FD1C5', // Teal/Green ring
        padding: 2,
        marginRight: 16,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userRole: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    cardInfo: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    menuContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30, // Although design implies full width, radius looks better
        overflow: 'hidden',
    },
    scrollContent: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 4,
    },
    menuIconBox: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 12,
        marginVertical: 16,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F5', // Light red
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    logoutText: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    versionText: {
        color: '#A0AEC0',
        fontSize: 12,
    },
});
