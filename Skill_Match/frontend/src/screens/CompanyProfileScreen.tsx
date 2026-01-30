import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Edit2, CheckCircle, MapPin, Globe, Users, Briefcase, LogOut } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ManualDataService } from '../services/ManualDataService';
import { useUserStore } from '../store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompanyProfileScreen = ({ route, navigation }: any) => {
    const userId = useUserStore((state) => state.userId);
    const params = route.params || {};
    const targetId = params.employerId || userId;
    const isOwnProfile = userId === targetId;

    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [targetId])
    );

    const fetchProfile = async () => {
        if (!targetId) return;
        setLoading(true);
        const { data, error } = await ManualDataService.getProfile(targetId);
        if (data) {
            setCompanyData({
                name: data.company_name || 'Company Name',
                tagline: data.tagline || 'Add a tagline',
                location: data.company_location || 'Location',
                website: data.website || 'Website',
                employees: data.company_size || 'Size',
                about: data.about_company || 'Add a description about your company.',
                industry: data.industry || 'Industry',
                founded: data.founded_year || 'Year',
                benefits: data.benefits || [],
                culture: data.culture || [],
                avatar: data.avatar_url || null
            });
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('supabase_token');
            await AsyncStorage.removeItem('supabase_user');
            // Reset to Welcome/Login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0066FF" />
            </SafeAreaView>
        );
    }

    if (!companyData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Failed to load profile.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={{ padding: 4, marginRight: 8 }}>
                        {/* Only show back button if pushed or not own profile? Usually back is always good if in stack */}
                        {/* Wait, if it's main tab, goBack might fail if nothing to go back to. But for JobDetails->Profile it works. */}
                        {/* Ensuring we have a back icon if not on main tab */}
                        {!isOwnProfile && <LogOut size={24} color="#111827" style={{ transform: [{ rotate: '180deg' }] }} />}
                    </View>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{isOwnProfile ? 'My Company' : 'Company Profile'}</Text>

                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.logoContainer, { overflow: 'hidden' }]}>
                            {companyData.avatar ? (
                                <Image source={{ uri: companyData.avatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            ) : (
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                                    {companyData.name.substring(0, 2).toUpperCase()}
                                </Text>
                            )}
                        </View>
                        <View style={styles.headerInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.companyName}>{companyData.name}</Text>
                                <CheckCircle size={16} color="#10B981" style={{ marginLeft: 6 }} />
                                {isOwnProfile && (
                                    <TouchableOpacity onPress={() => navigation.navigate('EditBusinessInfo')} style={{ marginLeft: 'auto' }}>
                                        <Edit2 size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text style={styles.tagline}>{companyData.tagline}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsList}>
                        <View style={styles.detailItem}>
                            <MapPin size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{companyData.location}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Globe size={16} color="#6B7280" />
                            <Text style={styles.detailTextLink}>{companyData.website}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Users size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{companyData.employees}</Text>
                        </View>
                    </View>
                </View>

                {/* Verified Banner */}
                <View style={styles.verifiedBanner}>
                    <CheckCircle size={24} color="#10B981" />
                    <View style={styles.verifiedContent}>
                        <Text style={styles.verifiedTitle}>Verified Company</Text>
                        <Text style={styles.verifiedSubtitle}>This company profile has been verified by SkillMatch</Text>
                    </View>
                </View>

                {/* About Us */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>About Us</Text>
                    <Text style={styles.bodyText}>{companyData.about}</Text>

                    <View style={styles.divider} />

                    <View style={styles.metaRow}>
                        <View>
                            <Text style={styles.metaLabel}>Industry</Text>
                            <Text style={styles.metaValue}>{companyData.industry}</Text>
                        </View>
                        <View>
                            <Text style={styles.metaLabel}>Founded</Text>
                            <Text style={styles.metaValue}>{companyData.founded}</Text>
                        </View>
                    </View>
                </View>

                {/* Benefits */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Benefits & Perks</Text>
                    <View style={styles.tagContainer}>
                        {companyData.benefits.length > 0 ? (
                            companyData.benefits.map((item: string, index: number) => (
                                <View key={index} style={styles.benefitTag}>
                                    <Text style={styles.benefitText}>{item}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#9CA3AF' }}>No benefits listed</Text>
                        )}
                    </View>
                </View>

                {/* Culture */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Company Culture</Text>
                    <View style={styles.tagContainer}>
                        {companyData.culture.length > 0 ? (
                            companyData.culture.map((item: string, index: number) => (
                                <View key={index} style={styles.cultureTag}>
                                    <Text style={styles.cultureText}>{item}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#9CA3AF' }}>No culture tags listed</Text>
                        )}
                    </View>
                </View>

                {/* Account Actions - Only for Own Profile */}
                {isOwnProfile && (
                    <View style={styles.sectionCard}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <LogOut size={20} color="#EF4444" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
        paddingVertical: 12,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#0066FF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    tagline: {
        fontSize: 14,
        color: '#6B7280',
        paddingRight: 16,
    },
    detailsList: {
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
    },
    detailTextLink: {
        fontSize: 14,
        color: '#2563EB',
    },
    verifiedBanner: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    verifiedContent: {
        flex: 1,
    },
    verifiedTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 2,
    },
    verifiedSubtitle: {
        fontSize: 12,
        color: '#065F46',
        lineHeight: 18,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 40,
    },
    metaLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    metaValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    benefitTag: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    benefitText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '500',
    },
    cultureTag: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    cultureText: {
        fontSize: 12,
        color: '#2563EB',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});

export default CompanyProfileScreen;
