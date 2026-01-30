import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, FileQuestion, ChevronRight, Mail, ChevronDown, ChevronUp, Phone } from 'lucide-react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const HelpSupportScreen = ({ navigation }: any) => {
    const [currentView, setCurrentView] = useState<'menu' | 'faq'>('menu');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const faqs = [
        {
            id: '1',
            question: "How do I update my resume?",
            answer: "Go to your Profile tab and scroll down to the Resume section. Tap 'Update' or 'Upload Resume' to select a new PDF or DOC file from your device."
        },
        {
            id: '2',
            question: "How can I change my job preferences?",
            answer: "Navigate to the Settings or Edit Profile section where you can adjust your preferred job types, salary range, and commute distance."
        },
        {
            id: '3',
            question: "Is SkillMatch free to use?",
            answer: "Yes, SkillMatch is free for job seekers. You can browse, apply, and get AI recommendations at no cost."
        },
        {
            id: '4',
            question: "How does the AI matching work?",
            answer: "Our AI analyzes your skills, experience, and uploaded resume against job descriptions to provide a compatibility score, helping you find the best fit."
        },
        {
            id: '5',
            question: "I forgot my password. What should I do?",
            answer: "On the login screen, tap 'Forgot Password'. Follow the instructions sent to your email to reset your account credentials."
        }
    ];

    const toggleFaq = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedFaq(expandedFaq === id ? null : id);
    };



    const supportOptions = [
        {
            id: 'phone',
            title: 'Call Support',
            subtitle: '+91 9390527148',
            icon: <Phone size={24} color="#3B82F6" />,
            action: () => Linking.openURL('tel:+919390527148')
        },
        {
            id: 'email',
            title: 'Email Support',
            subtitle: 'karthikreddy4185.sse@saveetha.com',
            icon: <Mail size={24} color="#EF4444" />,
            action: () => Linking.openURL('mailto:karthikreddy4185.sse@saveetha.com')
        },
        {
            id: 'faq',
            title: 'Frequently Asked Questions',
            subtitle: 'Get answers quickly',
            icon: <FileQuestion size={24} color="#8B5CF6" />,
            action: () => setCurrentView('faq')
        }
    ];

    const renderMenu = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.banner}>
                <Text style={styles.bannerTitle}>How can we help you?</Text>
                <Text style={styles.bannerText}>Find answers to your questions or get in touch with our support team.</Text>
            </View>

            <View style={styles.optionsList}>
                {supportOptions.map((option) => (
                    <TouchableOpacity key={option.id} style={styles.optionItem} onPress={option.action}>
                        <View style={styles.iconContainer}>
                            {option.icon}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionText}>{option.title}</Text>
                            {option.subtitle && <Text style={styles.optionSubtitle}>{option.subtitle}</Text>}
                        </View>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.copyrightText}>© 2024 SkillMatch Inc.</Text>
            </View>
        </ScrollView>
    );

    const renderFaq = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
                {faqs.map((faq) => {
                    const isExpanded = expandedFaq === faq.id;
                    return (
                        <View key={faq.id} style={styles.faqItem}>
                            <TouchableOpacity
                                style={[styles.faqHeader, isExpanded && styles.faqHeaderExpanded]}
                                onPress={() => toggleFaq(faq.id)}
                            >
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                {isExpanded ? <ChevronUp size={20} color="#4B5563" /> : <ChevronDown size={20} color="#9CA3AF" />}
                            </TouchableOpacity>
                            {isExpanded && (
                                <View style={styles.faqBody}>
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => currentView === 'faq' ? setCurrentView('menu') : navigation.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{currentView === 'faq' ? 'FAQ' : 'Help & Support'}</Text>
                <View style={{ width: 24 }} />
            </View>

            {currentView === 'menu' ? renderMenu() : renderFaq()}

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
    scrollContent: {
        padding: 20,
    },
    banner: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 8,
        textAlign: 'center',
    },
    bannerText: {
        fontSize: 14,
        color: '#60A5FA',
        textAlign: 'center',
        lineHeight: 20,
    },
    optionsList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 32,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    footer: {
        alignItems: 'center',
        gap: 4,
    },
    versionText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    copyrightText: {
        fontSize: 12,
        color: '#D1D5DB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    faqList: {
        gap: 12,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqHeaderExpanded: {
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    faqQuestion: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 10,
    },
    faqBody: {
        padding: 16,
        backgroundColor: '#fff',
    },
    faqAnswer: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
});

export default HelpSupportScreen;
