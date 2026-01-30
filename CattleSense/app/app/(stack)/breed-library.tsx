import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BREED_DATA } from '../../constants/breedData';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 48 - 12) / COLUMN_COUNT; // 48 padding, 12 gap

export default function BreedLibraryScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    // Convert Record to Array and Filter
    const filteredBreeds = useMemo(() => {
        const breeds = Object.values(BREED_DATA);
        if (!search) return breeds.sort((a, b) => a.name.localeCompare(b.name));

        const lowerSearch = search.toLowerCase();
        return breeds.filter(b =>
            b.name.toLowerCase().includes(lowerSearch) ||
            b.origin.toLowerCase().includes(lowerSearch)
        ).sort((a, b) => a.name.localeCompare(b.name));
    }, [search]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/(stack)/breed-detail' as any, params: { breed: item.name } })}
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.breedName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.origin} numberOfLines={1}>
                    <Ionicons name="location-outline" size={10} color="#64748B" /> {item.origin}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Breed Library</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search breeds, origin..."
                        placeholderTextColor="#94A3B8"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Grid */}
                <FlatList
                    data={filteredBreeds}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.emptyText}>No breeds found matching "{search}"</Text>
                        </View>
                    }
                />

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#0F172A',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    imageContainer: {
        height: 120, // Compact height
        width: '100%',
        backgroundColor: '#E2E8F0',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    typeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 12,
    },
    breedName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    origin: {
        fontSize: 10, // Smaller text for secondary info
        color: '#64748B',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 12,
        color: '#94A3B8',
        fontSize: 16,
    }
});
