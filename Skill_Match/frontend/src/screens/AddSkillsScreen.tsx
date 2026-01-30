
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, X, Plus } from 'lucide-react-native';
import { useUserStore } from '../store/userStore';
import { ManualDataService } from '../services/ManualDataService';

const POPULAR_SKILLS = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'Docker', 'AWS',
    'TypeScript', 'HTML/CSS', 'MongoDB', 'GraphQL', 'REST API', 'Agile', 'Scrum'
];

const AddSkillsScreen = ({ navigation, route }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customSkill, setCustomSkill] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['UI Design', 'UX Research', 'Wireframing']); // Initial mockup data

    // Check if we are in onboarding flow
    const isOnboarding = route.params?.isOnboarding || false;

    const handleAddSkill = (skill: string) => {
        if (skill && !selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim()) {
            handleAddSkill(customSkill.trim());
            setCustomSkill('');
        }
    };

    const filteredPopularSkills = POPULAR_SKILLS.filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedSkills.includes(skill)
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {!isOnboarding && (
                    <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft color="#111" size={24} />
                    </TouchableOpacity>
                )}
                {isOnboarding && <View style={{ width: 40 }} />}
                <Text style={styles.headerTitle}>Add Skills</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Search */}
                <TextInput
                    placeholder="Search skills..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                />

                {/* Custom Skill */}
                <View style={styles.customSkillContainer}>
                    <TextInput
                        placeholder="Add custom skill"
                        style={styles.customInput}
                        value={customSkill}
                        onChangeText={setCustomSkill}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCustomSkill}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Your Skills */}
                <Text style={styles.sectionTitle}>Your Skills</Text>
                <View style={styles.chipsContainer}>
                    {selectedSkills.map((skill, index) => (
                        <TouchableOpacity key={index} style={styles.selectedChip} onPress={() => handleRemoveSkill(skill)}>
                            <Text style={styles.selectedChipText}>{skill}</Text>
                            <X size={16} color="#2563EB" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Popular Skills */}
                <Text style={styles.sectionTitle}>Popular Skills</Text>
                <View style={styles.chipsContainer}>
                    {filteredPopularSkills.map((skill, index) => (
                        <TouchableOpacity key={index} style={styles.popularChip} onPress={() => handleAddSkill(skill)}>
                            <Text style={styles.popularChipText}>{skill}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Footer / Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={async () => {
                        try {
                            const user = await ManualDataService.getUser();

                            if (!user) {
                                Alert.alert('Session Expired', 'Please login again.', [
                                    { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
                                ]);
                                return;
                            }

                            const { error } = await ManualDataService.updateProfile(user.id, { skills: selectedSkills });

                            if (error) throw new Error(error.message || 'Update failed');

                            if (isOnboarding) {
                                // If onboarding, go to Main app!
                                navigation.replace('Main');
                            } else {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate('Main');
                                }
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }}
                >
                    <Text style={styles.saveButtonText}>{isOnboarding ? 'Finish & Go to Dashboard' : 'Save Skills'}</Text>
                </TouchableOpacity>
            </View>
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
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    searchInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#111827',
    },
    customSkillContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    customInput: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#111827',
    },
    addButton: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF', // Light blue
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
    },
    selectedChipText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '500',
    },
    popularChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    popularChipText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'white',
        // borderTopWidth: 1,
        // borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 12, // User image has slightly sharper corners than fully round? No, looks like typical 8-12 radius
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddSkillsScreen;
