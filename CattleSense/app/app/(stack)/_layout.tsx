import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* All stack screens default to no header or custom handled */}
        </Stack>
    );
}
