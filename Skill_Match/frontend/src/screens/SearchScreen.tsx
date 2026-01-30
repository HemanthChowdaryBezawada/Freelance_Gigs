import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Clock, X, MapPin, Building2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ManualDataService } from '../services/ManualDataService';

const SearchScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const stored = await AsyncStorage.getItem('recent_searches');
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (e) {
            console.log("Failed to load recent searches");
        }
    };

    const saveRecentSearch = async (query: string) => {
        try {
            let updated = [query, ...recentSearches.filter(i => i !== query)].slice(0, 5);
            setRecentSearches(updated);
            await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
        } catch (e) {
            console.log("Failed to save recent search");
        }
    };

    const handleRemoveRecent = async (item: string) => {
        const updated = recentSearches.filter(i => i !== item);
        setRecentSearches(updated);
        await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        setSearchQuery(query);
        setShowResults(true);
        setLoading(true);
        saveRecentSearch(query);

        try {
            const { data } = await ManualDataService.searchJobs(query);
            setSearchResults(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
        setSearchResults([]);
    };

    const suggestedKeywords = [
        'Remote', 'Senior', 'Full-time', 'Entry Level', 'Contract',
        'Freelance', 'Part-time', 'Internship'
    ];

    const trendingSearches = [
        'AI Engineer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer'
    ];

    return (
        <SafeAreaView style={styles.container}>

            {/* Header with Search Input */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search Jobs</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <Search color="#9CA3AF" size={20} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search by title, skills, or company..."
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.length === 0) setShowResults(false);
                        }}
                        placeholderTextColor="#9CA3AF"
                        autoFocus={false}
                        onSubmitEditing={() => handleSearch(searchQuery)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch}>
                            <X color="#9CA3AF" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : showResults ? (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.resultCount}>{searchResults.length} jobs found</Text>
                    {searchResults.map((job) => (
                        <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => navigation.navigate('JobDetails', { job })}>
                            <View style={styles.jobHeader}>
                                <View style={styles.logoPlaceholder}>
                                    <Building2 size={24} color="#6B7280" />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.jobTitle}>{job.title}</Text>
                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyName}>{job.company_name}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.jobDetailsRow}>
                                <View style={styles.detailItem}>
                                    <MapPin size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{job.location || 'Remote'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailText}>{job.salary_range || 'Competitive'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Clock size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{new Date(job.created_at).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {searchResults.length === 0 && (
                        <View style={styles.noResults}>
                            <Text style={styles.noResultsText}>No jobs found matching "{searchQuery}"</Text>
                        </View>
                    )}
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            {recentSearches.map((item, index) => (
                                <View key={index} style={styles.recentItem}>
                                    <TouchableOpacity style={styles.recentItemClick} onPress={() => handleSearch(item)}>
                                        <Clock color="#9CA3AF" size={18} />
                                        <Text style={styles.recentText}>{item}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemoveRecent(item)}>
                                        <X color="#9CA3AF" size={18} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Suggested Keywords */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suggested Keywords</Text>
                        <View style={styles.chipsContainer}>
                            {suggestedKeywords.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.chip} onPress={() => handleSearch(item)}>
                                    <Text style={styles.chipText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Trending Searches */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending Searches</Text>
                        <View style={styles.trendingList}>
                            {trendingSearches.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.trendingItem} onPress={() => handleSearch(item)}>
                                    <View style={styles.hotBadge}>
                                        <Text style={styles.hotText}>HOT</Text>
                                    </View>
                                    <Text style={styles.trendingText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchBarContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    recentItemClick: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    recentText: {
        fontSize: 15,
        color: '#4B5563',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    chipText: {
        fontSize: 13,
        color: '#374151',
    },
    trendingList: {
        gap: 12,
    },
    trendingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        gap: 12,
    },
    hotBadge: {
        backgroundColor: '#FEE2E2', // Light Red/Pink
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    hotText: {
        color: '#EF4444', // Red
        fontSize: 10,
        fontWeight: 'bold',
    },
    trendingText: {
        fontSize: 15,
        color: '#4B5563',
    },
    // Job Card Styles
    resultCount: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    jobCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    jobHeader: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    companyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2
    },
    companyName: {
        fontSize: 13,
        color: '#6B7280',
    },
    jobDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#6B7280',
    },
    noResults: {
        alignItems: 'center',
        marginTop: 40,
    },
    noResultsText: {
        color: '#6B7280',
        fontSize: 16,
    }
});

export default SearchScreen;
