import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function HelpScreen() {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const faqs = [
        {
            id: 1,
            question: "How do I scan a cow?",
            answer: "Go to the 'Scan' tab, verify field conditions, and take a clear photo of the cow. Ensure the cow is visible and well-lit."
        },
        {
            id: 2,
            question: "What breeds are supported?",
            answer: "We mostly support indigenous breeds like Gir, Kangayam, Ongole, and many more. Check the 'Breed Library' for a full list."
        },
        {
            id: 3,
            question: "Can I use the app offline?",
            answer: "Yes! Enable 'Offline Mode' in Settings. You can save scans locally and sync them when you're back online."
        },
        {
            id: 4,
            question: "How do I update my profile?",
            answer: "Go to the Profile tab and click 'Edit Profile'. You can update your name, location, and profile picture."
        }
    ];

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEmail = () => {
        Linking.openURL('mailto:support@cattlesense.com?subject=Support Request');
    };

    const handleCall = () => {
        Linking.openURL('tel:+911234567890');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1A2A3A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Help & Support</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                    {faqs.map((faq) => (
                        <TouchableOpacity
                            key={faq.id}
                            style={[styles.faqCard, expandedId === faq.id && styles.activeCard]}
                            onPress={() => toggleExpand(faq.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={[styles.question, expandedId === faq.id && styles.activeQuestion]}>
                                    {faq.question}
                                </Text>
                                <Ionicons
                                    name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={expandedId === faq.id ? "#FF8008" : "#9AA5B1"}
                                />
                            </View>
                            {expandedId === faq.id && (
                                <Text style={styles.answer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.sectionTitle}>Contact Us</Text>

                    <View style={styles.contactRow}>
                        <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="mail" size={24} color="#2196F3" />
                            </View>
                            <Text style={styles.contactLabel}>Email Support</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
                            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="call" size={24} color="#4CAF50" />
                            </View>
                            <Text style={styles.contactLabel}>Call Center</Text>
                        </TouchableOpacity>
                    </View>

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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A2A3A',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A2A3A',
        marginBottom: 16,
        marginTop: 10,
    },
    faqCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        elevation: 1,
    },
    activeCard: {
        borderColor: '#FF8008',
        elevation: 2,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2A3A',
        flex: 1,
        marginRight: 10,
    },
    activeQuestion: {
        color: '#FF8008',
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: '#5B6B7C',
        lineHeight: 20,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '48%',
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A2A3A',
    },
});
