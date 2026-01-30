import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEmployer, setIsEmployer] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [])
    );

    const fetchChats = async () => {
        try {
            setLoading(true);
            const user = await ManualDataService.getUser();
            if (!user) return;

            // Determine Role
            const { data: profile } = await ManualDataService.getProfile(user.id);
            const isEmployerUser = profile?.role === 'employer' || profile?.role === 'EMPLOYER';
            setIsEmployer(isEmployerUser);

            let chats = [];

            if (isEmployerUser) {
                // Fetch Employer Chats (Applications to their jobs)
                const { data, profiles } = await ManualDataService.getEmployerChats(user.id);

                chats = await Promise.all((data || []).map(async (app: any) => {
                    const applicant = profiles?.get(app.applicant_id);
                    const name = applicant?.full_name || 'Anonymous Applicant';

                    // Fetch last message
                    const { data: lastMsg } = await ManualDataService.getLastMessage(app.id);
                    const messagePreview = lastMsg ? (lastMsg.content || lastMsg.text) : `Applied for: ${app.job?.title || 'Job'}`;
                    const time = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(app.created_at).toLocaleDateString();

                    return {
                        id: app.id,
                        sender: name, // Show Applicant Name to Employer
                        message: messagePreview,
                        time: time,
                        unread: 0,
                        initials: name.substring(0, 2).toUpperCase(),
                        color: '#10B981', // Green for applicants?
                        textColor: '#FFFFFF',
                        applicationId: app.id // Ensure we pass this for navigation
                    };
                }));

            } else {
                // Fetch Seeker Chats (My applications)
                const { data } = await ManualDataService.getAppliedJobs(user.id);

                chats = await Promise.all((data || []).map(async (app: any) => {
                    const companyName = app.job?.company_name || 'Unknown Company';

                    // Fetch last message
                    const { data: lastMsg } = await ManualDataService.getLastMessage(app.id);
                    const messagePreview = lastMsg ? (lastMsg.content || lastMsg.text) : `Status: ${app.status}`;
                    const time = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(app.applied_at).toLocaleDateString();

                    return {
                        id: app.id,
                        sender: companyName, // Show Company Name to Seeker
                        message: messagePreview,
                        time: time,
                        unread: app.status === 'pending' ? 1 : 0,
                        initials: companyName.substring(0, 2).toUpperCase(),
                        color: '#2563EB',
                        textColor: '#FFFFFF',
                        applicationId: app.id
                    };
                }));
            }

            setMessages(chats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.messageItem}
            onPress={() => navigation.navigate('ChatDetail', {
                name: item.sender,
                initials: item.initials,
                color: item.color,
                applicationId: item.id
            })}
        >
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={[styles.avatarText, { color: item.textColor }]}>{item.initials}</Text>
            </View>
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={styles.senderName}>{item.sender}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.messageBody}>
                    <Text style={styles.messageText} numberOfLines={1}>
                        {item.message}
                    </Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* Messages List */}
            {loading ? (
                <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={messages.filter(m => m.sender.toLowerCase().includes(searchQuery.toLowerCase()))}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {isEmployer
                                    ? "No messages yet. Applications will appear here."
                                    : "No messages yet. Apply to jobs to start chatting!"}
                            </Text>
                        </View>
                    }
                />
            )}
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
        backgroundColor: '#F9FAFB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
    },
    messageBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14
    }
});

export default ChatScreen;
