import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useScanStore } from '@/store/scanStore';

const BREEDS = [
    'Murrah', 'Gir', 'Sahiwal', 'Red Sindhi', 'Jaffarabadi', 'Nili-Ravi', 'Surti', 'Mehsana', 'Banni'
];

export default function ManualSelectScreen() {
    const router = useRouter();
    const { setPredictions, capturedImage } = useScanStore();
    const [search, setSearch] = useState('');

    const filtered = BREEDS.filter(b => b.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (breed: string) => {
        // Manually set result with 100% confidence (user override)
        setPredictions([{ breed, confidence: 1.0 }]);
        router.replace('/(stack)/result-high' as any);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color="#1A2A3A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Breed</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9AA5B1" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search breed name..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <Text style={styles.sectionHeader}>Detected Image</Text>
                <View style={styles.imagePreview}>
                    <Image source={{ uri: capturedImage! }} style={styles.thumb} />
                    <Text style={styles.helperText}>Select the correct breed for this animal.</Text>
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    {filtered.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.listItem}
                            onPress={() => handleSelect(item)}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item[0]}</Text>
                            </View>
                            <Text style={styles.listText}>{item}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#D1D9E6" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A2A3A',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5B6B7C',
        marginLeft: 20,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    imagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 20,
    },
    thumb: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 16,
        backgroundColor: '#EEE',
    },
    helperText: {
        color: '#5B6B7C',
        fontSize: 14,
        flex: 1,
    },
    list: {
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#2196F3',
        fontWeight: 'bold',
        fontSize: 18,
    },
    listText: {
        flex: 1,
        fontSize: 16,
        color: '#1A2A3A',
        fontWeight: '500',
    },
});
