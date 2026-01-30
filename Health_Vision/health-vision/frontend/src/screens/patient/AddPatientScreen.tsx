import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useNavigation } from '@react-navigation/native';
import { patientService } from '../../services/PatientService';

export const AddPatientScreen = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [room, setRoom] = useState('');
    const [condition, setCondition] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !age || !gender || !room || !condition) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await patientService.addPatient({
                full_name: name,
                age: parseInt(age),
                gender: gender,
                room_number: room,
                condition,
                notes
            });
            Alert.alert('Success', 'Patient added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Add Patient" showBack />
            <ScrollView contentContainerStyle={styles.content}>

                <Input
                    label="Full Name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Input
                            label="Age"
                            placeholder="e.g. 65"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />
                    </View>
                    <View style={styles.half}>
                        <Input
                            label="Gender"
                            placeholder="e.g. Male"
                            value={gender}
                            onChangeText={setGender}
                        />
                    </View>
                </View>

                <Input
                    label="Room Number"
                    placeholder="e.g. 101"
                    value={room}
                    onChangeText={setRoom}
                />

                <Input
                    label="Medical Condition"
                    placeholder="e.g. Post-Surgery Recovery"
                    value={condition}
                    onChangeText={setCondition}
                />

                <Input
                    label="Notes"
                    placeholder="Additional care instructions or history..."
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                    style={{ height: 100, textAlignVertical: 'top' }}
                />

                <Button
                    title={loading ? "Saving..." : "Save Patient"}
                    onPress={handleSave}
                    style={{ marginTop: spacing.m }}
                    disabled={loading}
                />

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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    half: {
        width: '48%',
    }
});
