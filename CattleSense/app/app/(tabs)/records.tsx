import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, TextInput, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getScans, DEV_BACKEND_URL } from '../../services/api';

const FILTERS = [
    { id: 'All', label: 'All' },
    { id: 'Month', label: 'This Month' },
];

export default function RecordsScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const mobileNumber = "1234567890";

    useFocusEffect(
        useCallback(() => {
            loadRecords();
        }, [])
    );

    const loadRecords = async () => {
        setLoading(true);
        try {
            const data = await getScans(mobileNumber);
            setRecords(data);
        } catch (error) {
            console.log("Failed to load records");
        } finally {
            setLoading(false);
        }
    };

    const filtered = records.filter((item: any) =>
        item.breed.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }: { item: any }) => {
        // Construct Image URL
        let imageUrl = item.image;
        if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = `${DEV_BACKEND_URL}${imageUrl}`;
        }

        return (
            <View style={styles.recordCard}>
                {/* Full Width Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            typeof imageUrl === 'string'
                                ? { uri: imageUrl }
                                : imageUrl || { uri: 'https://via.placeholder.com/150' }
                        }
                        style={styles.cardCover}
                    />
                </View>

                <View style={styles.cardContent}>
                    {/* Header Row: Name & Confidence */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.breedName}>{item.breed}</Text>
                        <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>{(item.confidence * 100).toFixed(0)}%</Text>
                        </View>
                    </View>

                    {/* Record ID */}
                    <Text style={styles.recordId}>Record ID: #{item.id}</Text>

                    {/* Meta Row: Date & Location */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{item.date}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{item.location}</Text>
                        </View>
                    </View>

                    {/* Actions Row */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => router.push({ pathname: '/(stack)/breed-detail' as any, params: { breed: item.breed } })} // Assuming breed-detail works for records too or map correctly
                        >
                            <Text style={styles.viewButtonText}>View Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="share-social-outline" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={(router as any).openDrawer} style={{ marginRight: 16 }}>
                            <Ionicons name="menu" size={28} color="#1F2937" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Records</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="filter" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search records..."
                        placeholderTextColor="#9CA3AF"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsList}>
                        {FILTERS.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tab, activeFilter === tab.id && styles.activeTab]}
                                onPress={() => setActiveFilter(tab.id)}
                            >
                                <Text style={[styles.tabText, activeFilter === tab.id && styles.activeTabText]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Records List */}
                <FlatList
                    data={filtered}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        marginHorizontal: 20,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#111827',
    },
    tabsContainer: {
        marginBottom: 8,
    },
    tabsList: {
        paddingHorizontal: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeTab: {
        backgroundColor: '#1B4332',
        borderColor: '#1B4332',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    activeTabText: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    recordCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    imageContainer: {
        height: 180,
        width: '100%',
        backgroundColor: '#E5E7EB',
    },
    cardCover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    breedName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    confidenceBadge: {
        backgroundColor: '#DCFCE7', // Light green
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    confidenceText: {
        color: '#166534', // Darker green text
        fontSize: 12,
        fontWeight: 'bold',
    },
    recordId: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    viewButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 14,
    },
    iconButton: {
        backgroundColor: '#F3F4F6',
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
