import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Calendar, Briefcase, CheckCircle, Clock } from 'lucide-react-native';

const NOTIFICATIONS = [
    {
        id: '1',
        type: 'application',
        title: 'Application Viewed',
        message: 'Tech Solutions Inc. viewed your application for "Senior React Native Developer".',
        time: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'You have an interview scheduled with Creative Agency for tomorrow at 10:00 AM.',
        time: '5 hours ago',
        read: false,
    },
    {
        id: '3',
        type: 'job_alert',
        title: 'New Job Alert',
        message: '3 new jobs found for "UI/UX Designer" in San Francisco.',
        time: '1 day ago',
        read: true,
    },
    {
        id: '4',
        type: 'system',
        title: 'Profile Update',
        message: 'Your profile completion is at 85%. Add more skills to reach 100%.',
        time: '2 days ago',
        read: true,
    },
];

const NotificationsScreen = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'application': return <Briefcase size={20} color="#2563EB" />;
            case 'interview': return <Calendar size={20} color="#10B981" />;
            case 'job_alert': return <Bell size={20} color="#F59E0B" />;
            case 'success': return <CheckCircle size={20} color="#10B981" />;
            default: return <Bell size={20} color="#6B7280" />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                {getIcon(item.type)}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity onPress={markAllAsRead}>
                    <Text style={styles.markAllText}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Bell size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    markAllText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    listContent: {
        padding: 20,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        alignItems: 'flex-start',
    },
    unreadCard: {
        backgroundColor: '#EFF6FF',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    unreadTitle: {
        color: '#1F2937',
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    messageText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2563EB',
        marginLeft: 8,
        marginTop: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
    }
});

export default NotificationsScreen;
