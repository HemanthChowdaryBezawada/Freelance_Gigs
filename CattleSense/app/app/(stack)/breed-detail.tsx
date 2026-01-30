import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { BREED_DATA, DEFAULT_BREED } from '../../constants/breedData';

export default function BreedDetailScreen() {
    const router = useRouter();
    const { breed } = useLocalSearchParams();

    // specific breed data lookup
    const breedNameParam = Array.isArray(breed) ? breed[0] : breed;

    // Find key case-insensitively or exact match
    const findBreedData = (name: string | undefined) => {
        if (!name) return DEFAULT_BREED;
        // Try exact match
        if (BREED_DATA[name]) return BREED_DATA[name];

        // Try case insensitive find
        const key = Object.keys(BREED_DATA).find(k => k.toLowerCase() === name.toLowerCase());
        if (key) return BREED_DATA[key];

        // Fallback with name
        return {
            ...DEFAULT_BREED,
            name: name
        };
    };

    const data = findBreedData(breedNameParam);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Hero Image */}
            <View style={styles.imageHeader}>
                <Image source={data.image} style={styles.heroImage} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradientOverlay}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={styles.headerText}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{data.type}</Text>
                        </View>
                        <Text style={styles.title}>{data.name}</Text>
                        <Text style={styles.location}>
                            <Ionicons name="location" size={16} color="#DDD" /> {data.origin}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Physical Characteristics</Text>
                    <View style={styles.traitsList}>
                        {data.traits.map((trait: string, idx: number) => (
                            <View key={idx} style={styles.traitItem}>
                                <Ionicons name="paw" size={16} color="#FF8008" />
                                <Text style={styles.traitText}>{trait}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.bodyText}>{data.desc}</Text>
                </View>

                <View style={styles.gridSection}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Milk Yield / Lactation</Text>
                        <Text style={styles.gridValue}>{data.milkYield}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Conservation Status</Text>
                        <Text style={styles.gridValue}>Least Concern</Text>
                    </View>
                </View>

                {/* Simulated similar breeds */}
                {/* Similar breeds section removed */}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    imageHeader: {
        height: 350,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    safeArea: {
        marginLeft: 16,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        padding: 24,
        paddingBottom: 60, // Increased to prevent overlap
    },
    tag: {
        backgroundColor: '#FF8008',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    tagText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#EEE',
    },
    content: {
        flex: 1,
        marginTop: -30,
        backgroundColor: '#F5F7FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 12,
    },
    traitsList: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
    },
    traitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    traitText: {
        fontSize: 16,
        color: '#5B6B7C',
    },
    bodyText: {
        fontSize: 16,
        color: '#5B6B7C',
        lineHeight: 24,
    },
    gridSection: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    gridItem: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gridLabel: {
        fontSize: 12,
        color: '#9AA5B1',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    gridValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    horizontalScroll: {
        flexDirection: 'row',
    },
    similarCard: {
        width: 120,
        marginRight: 12,
    },
    placeholderImg: {
        width: 120,
        height: 80,
        backgroundColor: '#E1E8ED',
        borderRadius: 8,
        marginBottom: 8,
    },
    similarText: {
        fontSize: 14,
        color: '#1A2A3A',
        fontWeight: '500',
    }
});
