import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send } from 'lucide-react-native';

const ChatDetailScreen = ({ route, navigation }: any) => {
    const { name, initials, color, initialMessage, applicationId } = route.params || { name: 'Chat', initials: 'CH', color: '#2563EB' };

    // Import ManualDataService
    const { ManualDataService } = require('../services/ManualDataService');

    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    React.useEffect(() => {
        const initChat = async () => {
            const user = await ManualDataService.getUser();
            if (user) {
                setUserId(user.id);
                fetchMessages();
            }
        };

        initChat();

        // Optional: Poll for messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [applicationId]); // Re-run if app Id changes

    const fetchMessages = async () => {
        if (!applicationId) return;
        const { data } = await ManualDataService.getMessages(applicationId);

        if (data && data.length > 0) {
            const formattedMessages = data.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                sender: msg.sender_id === userId ? 'me' : 'them', // Note: userId ref might be stale if logic inside fetchMessages, but usually ok if defined outside or used via ref. 
                // Better to map inside setMessages or use current userId state which should be set by now.
                // Let's do simple mapping:
                senderId: msg.sender_id,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages(formattedMessages);
        }
    };

    // Handle initial message (automated invite)
    React.useEffect(() => {
        const sendInitial = async () => {
            if (initialMessage && userId && applicationId) {
                // Check if we already sent this? For now, just send.
                // Ideally, ScheduleInterviewScreen should send it, but if it didn't, we do it here.
                // Actually, ScheduleInterviewScreen should send it to DB. If we rely on this, it's brittle.
                // But the requested flow was "Schedule -> Navigate -> Chat with message".
                // If I change ScheduleInterview to SAVE to DB, then I don't need `initialMessage` here really, 
                // OR `initialMessage` is just for "optimistic UI" until refresh.
                // Let's assume ScheduleInterview will SAVE it.
                // BUT if I want to show it immediately without fetch delay, I can append it.
            }
        };
        // sendInitial();
    }, [initialMessage, userId]);

    const sendMessage = async () => {
        if (!inputText.trim() || !userId || !applicationId) return;

        const text = inputText;
        setInputText(''); // Clear immediately

        // Optimistic update
        const tempId = Date.now().toString();
        const newMsg = {
            id: tempId,
            text: text,
            sender: 'me', // renderItem uses 'sender' === 'me' check or we update renderItem
            senderId: userId,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);

        await ManualDataService.sendMessage(applicationId, userId, text);
        fetchMessages(); // Refresh to get real ID and stored state
    };

    const renderItem = ({ item }: any) => {
        const isMe = item.sender === 'me' || item.senderId === userId;
        return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
                <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
                <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>{item.time}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.backButton}>
                    <ChevronLeft color="#1F2937" size={24} />
                </TouchableOpacity>

                <View style={[styles.avatar, { backgroundColor: color }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{name}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>


            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerStatus: {
        fontSize: 12,
        color: '#10B981', // Green for online
    },

    listContent: {
        padding: 20,
        gap: 12,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myText: {
        color: '#fff',
    },
    theirText: {
        color: '#1F2937',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    theirTime: {
        color: '#9CA3AF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        fontSize: 15,
        color: '#111827',
    },
    sendButton: {
        backgroundColor: '#2563EB',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatDetailScreen;
