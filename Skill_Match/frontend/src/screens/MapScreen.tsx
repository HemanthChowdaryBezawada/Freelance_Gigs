
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation } from 'lucide-react-native';
import { ManualDataService } from '../services/ManualDataService';

// Static coordinates for demo purposes
const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
    'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
    'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
    'Bengaluru': { latitude: 12.9716, longitude: 77.5946 },
    'Delhi': { latitude: 28.7041, longitude: 77.1025 },
    'New Delhi': { latitude: 28.6139, longitude: 77.2090 },
    'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
    'Pune': { latitude: 18.5204, longitude: 73.8567 },
    'Chennai': { latitude: 13.0827, longitude: 80.2707 },
    'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
    'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
    'Gurgaon': { latitude: 28.4595, longitude: 77.0266 },
    'Noida': { latitude: 28.5355, longitude: 77.3910 },
    'Remote': { latitude: 20.5937, longitude: 78.9629 }, // Center of India
};

const MapScreen = ({ navigation }: any) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [clusters, setClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const webViewRef = useRef<WebView>(null);

    // Initial load logic
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const user = await ManualDataService.getUser();
            const { data } = await ManualDataService.getNearbyJobs('', user?.id);

            // Group by location
            const grouped: Record<string, any[]> = {};

            (data || []).forEach((job: any) => {
                let loc = job.location ? job.location.trim() : 'Remote';
                const cityKey = Object.keys(CITY_COORDINATES).find(city => loc.includes(city));
                const key = cityKey || loc;

                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(job);
            });

            const clusterArray = Object.keys(grouped).map(key => {
                const coords = CITY_COORDINATES[key] || {
                    latitude: 20.5937 + (Math.random() - 0.5) * 5,
                    longitude: 78.9629 + (Math.random() - 0.5) * 5
                };
                return {
                    location: key,
                    jobs: grouped[key],
                    coordinate: coords,
                    count: grouped[key].length
                };
            });

            setClusters(clusterArray);
            setJobs(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    // Leaflet HTML Template
    const generateHtml = (clustersData: any[]) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { padding: 0; margin: 0; }
                #map { width: 100%; height: 100vh; }
                .custom-cluster {
                    background-color: #2563EB;
                    color: white;
                    border-radius: 50%;
                    text-align: center;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map').setView([20.5937, 78.9629], 5);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                // Fix marker icons
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });

                var clusters = ${JSON.stringify(clustersData)};

                clusters.forEach(function(c) {
                    var icon = L.divIcon({
                        className: 'custom-cluster',
                        html: c.count,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    });

                    var marker = L.marker([c.coordinate.latitude, c.coordinate.longitude], { icon: icon })
                        .addTo(map)
                        .on('click', function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'CLUSTER_SELECTED',
                                location: c.location
                            }));
                        });
                    
                    // Simple popup
                    marker.bindPopup("<b>" + c.location + "</b><br>" + c.count + " Jobs");
                });
            </script>
        </body>
        </html>
    `;


    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'CLUSTER_SELECTED') {
                setSelectedLocation(data.location);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleViewRoute = (latitude: number, longitude: number, label: string) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    const filteredJobs = selectedLocation
        ? clusters.find(c => c.location === selectedLocation)?.jobs || []
        : jobs;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.headerContainer} edges={['top']}>
                <View style={styles.header}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Job Map (OpenStreetMap)</Text>
                        <Text style={styles.headerSubtitle}>{jobs.length} Active Jobs</Text>
                    </View>
                </View>
            </SafeAreaView>

            <View style={styles.mapContainer}>
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: generateHtml(clusters) }}
                    style={styles.map}
                    onMessage={handleMessage}
                />
            </View>

            <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                    <View>
                        <Text style={styles.listTitle}>
                            {selectedLocation ? `Jobs in ${selectedLocation}` : 'All Jobs'}
                        </Text>
                        {selectedLocation && (
                            <TouchableOpacity
                                style={styles.viewRouteButton}
                                onPress={() => {
                                    const cluster = clusters.find(c => c.location === selectedLocation);
                                    if (cluster) {
                                        handleViewRoute(cluster.coordinate.latitude, cluster.coordinate.longitude, cluster.location);
                                    }
                                }}
                            >
                                <Navigation size={14} color="#2563EB" />
                                <Text style={styles.viewRouteText}>View Route</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {selectedLocation && (
                        <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                            <Text style={styles.clearFilterText}>Show All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {filteredJobs.map((job: any) => (
                            <TouchableOpacity
                                key={job.id}
                                style={styles.companyCard}
                                onPress={() => navigation.navigate('JobDetails', { job })}
                            >
                                <View style={styles.companyIconBox}>
                                    <Text style={styles.companyInitials}>{(job.company_name || 'CO').substring(0, 2).toUpperCase()}</Text>
                                </View>
                                <View style={styles.companyInfo}>
                                    <Text style={styles.companyName}>{job.title}</Text>
                                    <View style={styles.metaRow}>
                                        <Text style={styles.metaText}>{job.company_name}</Text>
                                        <Text style={styles.dotSeparator}>•</Text>
                                        <Text style={styles.metaText}>{job.location || 'Remote'}</Text>
                                    </View>
                                </View>
                                <View style={styles.jobsBadge}>
                                    <MapPin size={12} color="#2563EB" />
                                </View>
                            </TouchableOpacity>
                        ))}
                        {filteredJobs.length === 0 && (
                            <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 20 }}>No jobs found in this area.</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        backgroundColor: '#fff',
        zIndex: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    mapContainer: {
        height: Dimensions.get('window').height * 0.45,
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    viewRouteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    viewRouteText: {
        fontSize: 13,
        color: '#2563EB',
        fontWeight: '500',
    },
    clearFilterText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    companyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        marginBottom: 12,
    },
    companyIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    companyInitials: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    companyInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    dotSeparator: {
        marginHorizontal: 6,
        color: '#D1D5DB',
        fontSize: 12,
    },
    jobsBadge: {
        backgroundColor: '#EFF6FF',
        padding: 8,
        borderRadius: 20,
    },
});

export default MapScreen;
