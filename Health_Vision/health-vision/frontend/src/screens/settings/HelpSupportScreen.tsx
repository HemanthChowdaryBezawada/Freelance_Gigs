import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ChevronDown, Mail, Phone } from 'lucide-react-native';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.questionRow}>
                <Text style={styles.question}>{question}</Text>
                <ChevronDown
                    size={20}
                    color={colors.text.tertiary}
                    style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                />
            </View>
            {expanded && <Text style={styles.answer}>{answer}</Text>}
        </TouchableOpacity>
    );
};

export const HelpSupportScreen = () => {
    return (
        <View style={styles.container}>
            <Header title="Help & Support" showBack />
            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <FAQItem
                    question="How do I reset my password?"
                    answer="For security reasons, please contact your System Administrator to request a password reset. They will provide you with a temporary password."
                />

                <FAQItem
                    question="How do I add a new patient?"
                    answer="Navigate to the 'Patients' tab and tap the '+' button in the top right corner. Fill in the required details and save."
                />

                <FAQItem
                    question="What does the 'Vision Analysis' do?"
                    answer="It uses AI to analyze video feeds or uploaded clips to detect falls or anomalies. Results are logged as alerts automatically."
                />

                <FAQItem
                    question="How do I clear an alert?"
                    answer="Go to the Alerts tab, tap on an alert to view details, and select 'Resolve' or 'Acknowledge'."
                />

                <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Contact Support</Text>

                <View style={styles.contactCard}>
                    <View style={styles.contactItem}>
                        <Mail size={20} color={colors.primary} />
                        <Text style={styles.contactText}>thanvithareddyinduru@gmail.com</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.contactItem}>
                        <Phone size={20} color={colors.primary} />
                        <Text style={styles.contactText}>+91 9959022892</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.m,
    },
    sectionTitle: {
        fontSize: typography.sizes.h3,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.m,
    },
    faqItem: {
        backgroundColor: colors.surface,
        marginBottom: spacing.s,
        borderRadius: layout.borderRadius.m,
        padding: spacing.m,
        overflow: 'hidden',
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text.primary,
        flex: 1,
        marginRight: spacing.s,
    },
    answer: {
        marginTop: spacing.m,
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.m,
        padding: spacing.m,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
    },
    contactText: {
        marginLeft: spacing.m,
        fontSize: 16,
        color: colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.s,
    }
});
