import AsyncStorage from '@react-native-async-storage/async-storage';

// Same constants as ManualSupabase to ensure consistency
const SUPABASE_URL = 'https://yqdzwruwcgsigxmofftt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZHp3cnV3Y2dzaWd4bW9mZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzE2OTYsImV4cCI6MjA4NDI0NzY5Nn0.2U5GoONA3URwqmqeN3U9plWm6ajAtxmG4bKZxPK4NMI';

export const ManualDataService = {
    async getHeaders() {
        const token = await AsyncStorage.getItem('supabase_token');
        return {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    },

    async getUser() {
        const userStr = await AsyncStorage.getItem('supabase_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    async getProfile(userId: string) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');
            const headers = await this.getHeaders();

            const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Profile fetch failed: ${text}`);
            }

            const data = await response.json();
            return { data: data[0], error: null };
        } catch (error: any) {
            console.error("ManualProfileFetch Error:", error);
            return { data: null, error };
        }
    },

    async updateProfile(userId: string, updates: any) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Update failed: ${text}`);
            }

            const data = await response.json();
            return { data: data[0], error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    },

    async getNearbyJobs(location: string = 'India', userId?: string) {
        try {
            const headers = await this.getHeaders();
            let queryUrl = `${SUPABASE_URL}/rest/v1/jobs?select=*`;

            if (location) {
                queryUrl += `&location=ilike.*${location}*`;
            }

            const response = await fetch(queryUrl, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            let data = await response.json();

            // Filter applied jobs if userId is provided
            if (userId && data.length > 0) {
                const appliedResponse = await this.getAppliedJobs(userId);
                const appliedJobIds = new Set((appliedResponse.data || []).map((app: any) => app.job_id));
                data = data.filter((job: any) => !appliedJobIds.has(job.id));
            }

            return { data, error: null };
        } catch (error: any) {
            console.error("Fetch Jobs Error:", error);
            return { data: [], error };
        }
    },

    async getAppliedJobs(userId: string) {
        try {
            const headers = await this.getHeaders();
            // Using assumed 'job:jobs(*)' syntax for relation. If relation doesn't exist, this might error.
            // Fallback: fetch without join if this fails? No, let's try join first.
            const response = await fetch(`${SUPABASE_URL}/rest/v1/applications?applicant_id=eq.${userId}&select=*,job:jobs(*)`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                console.log("Applied Jobs Fetch Error:", await response.text());
                return { data: [], error: null };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error: any) {
            console.error("Applied Jobs Network Error:", error);
            return { data: [], error };
        }
    },

    async applyForJob(jobId: string, userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    job_id: jobId,
                    applicant_id: userId,
                    status: 'pending',
                    applied_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Apply Job Failed:", response.status, text);

                if (text.includes('duplicate key') || text.includes('23505')) {
                    return { error: 'You have already applied for this job' };
                }
                return { error: `Application failed: ${text}` };
            }
            return { data: true, error: null };
        } catch (error: any) {
            console.error("Apply Job Network Error:", error);
            return { data: null, error: error.message || "Network request failed" };
        }
    },

    async hasApplied(jobId: string, userId: string): Promise<boolean> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/applications?job_id=eq.${jobId}&applicant_id=eq.${userId}&select=id`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) return false;
            const data = await response.json();
            return data.length > 0;
        } catch (error) {
            return false;
        }
    },

    async getSavedJobs(userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_jobs?user_id=eq.${userId}&select=*,job:jobs(*)&order=created_at.desc`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                console.log("Saved Jobs Fetch Error:", await response.text());
                return { data: [], error: null };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error: any) {
            console.error("Saved Jobs Network Error:", error);
            return { data: [], error };
        }
    },

    async saveJob(jobId: string, userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_jobs`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    job_id: jobId,
                    user_id: userId,
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const text = await response.text();
                // If already saved, treat as success (idempotent)
                if (text.includes('duplicate key')) {
                    return { data: true, error: null };
                }
                throw new Error(text);
            }
            return { data: true, error: null };

        } catch (error: any) {
            return { data: null, error };
        }
    },

    async isJobSaved(jobId: string, userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_jobs?job_id=eq.${jobId}&user_id=eq.${userId}&select=count`, {
                method: 'HEAD',
                headers: headers
            });

            if (!response.ok) return false;

            // Content-Range format: 0-0/1 (if 1 result)
            const range = response.headers.get('Content-Range');
            if (range) {
                const total = parseInt(range.split('/')[1]);
                return total > 0;
            }

            return false;
        } catch (error) {
            console.error("Check Saved Status Error:", error);
            return false;
        }
    },

    async unsaveJob(jobId: string, userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_jobs?job_id=eq.${jobId}&user_id=eq.${userId}`, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }
            return { data: true, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    },

    async getAIRecommendations(userId: string) {
        try {
            const { data: profile } = await this.getProfile(userId);
            const userSkills = profile?.skills || [];

            // 1. Get IDs of jobs already applied to
            const appliedResponse = await this.getAppliedJobs(userId);
            const appliedJobIds = new Set((appliedResponse.data || []).map((app: any) => app.job_id));

            // Fetch all jobs
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&order=created_at.desc&limit=50`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) return { data: [], error: 'Failed to fetch jobs' };
            const allJobs = await response.json();

            // 2. Filter out applied jobs
            const candidateJobs = allJobs.filter((job: any) => !appliedJobIds.has(job.id));

            // Simple Scoring Algorithm
            const scoredJobs = candidateJobs.map((job: any) => {
                let matchPercent = 0;
                const userSkillsList = (userSkills && Array.isArray(userSkills)) ? userSkills : [];
                const jobSkillsList = (job.skills && Array.isArray(job.skills)) ? job.skills : [];

                // 1. Strict Skill Percentage
                if (jobSkillsList.length > 0) {
                    // Method A: Job has explicit skills
                    let matchCount = 0;
                    jobSkillsList.forEach((reqSkill: string) => {
                        if (userSkillsList.some((uSkill: string) => uSkill.toLowerCase() === reqSkill.toLowerCase())) {
                            matchCount++;
                        }
                    });
                    matchPercent = Math.round((matchCount / jobSkillsList.length) * 100);
                } else if (userSkillsList.length > 0) {
                    // Method B: Fallback (User skills intersection with Job Description)
                    let foundCount = 0;
                    const jobText = (job.title + " " + job.description + " " + (job.requirements || "")).toLowerCase();
                    userSkillsList.forEach((uSkill: string) => {
                        if (jobText.includes(uSkill.toLowerCase())) {
                            foundCount++;
                        }
                    });
                    matchPercent = Math.round((foundCount / userSkillsList.length) * 100);
                }

                // 2. Title Match Boost (Bonus)
                if (profile?.headline) {
                    const headline = profile.headline.toLowerCase();
                    const jobTitle = job.title.toLowerCase();
                    if (jobTitle.includes(headline) || headline.includes(jobTitle)) {
                        matchPercent = Math.min(matchPercent + 15, 100);
                        if (matchPercent < 40) matchPercent = 60;
                    }
                }

                if (matchPercent < 30) return null;
                matchPercent = Math.min(matchPercent, 98);

                return { ...job, match: `${matchPercent}%`, matchScore: matchPercent };
            }).filter((job: any) => job !== null && job.matchScore >= 40);

            // Sort by match score
            scoredJobs.sort((a: any, b: any) => b.matchScore - a.matchScore);

            return { data: scoredJobs, error: null };

        } catch (error: any) {
            console.error("AI Algo Error:", error);
            return { data: [], error };
        }
    },

    async uploadAvatar(userId: string, fileUri: string) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');
            const timestamp = Date.now();
            const fileName = `${userId}/${timestamp}.jpg`;

            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            } as any);

            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/avatars/${fileName}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Avatar upload failed');
            }

            const data = await response.json();
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
            return { publicUrl, error: null };
        } catch (error: any) {
            return { publicUrl: null, error };
        }
    },

    async uploadResume(userId: string, file: any) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop() || 'pdf';
            const fileName = `${userId}/${timestamp}.${fileExt}`;

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf',
            } as any);

            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/resumes/${fileName}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            // If bucket doesn't exist or permissions fail:
            // "statusCode": "404", "error": "Bucket not found"
            // "statusCode": "401", "message": "new row violates row-level security policy"

            if (!response.ok) {
                const text = await response.text();
                console.log("Resume Upload Error:", text);
                throw new Error('Resume upload failed: ' + text);
            }

            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;
            return { publicUrl, error: null };
        } catch (error: any) {
            return { publicUrl: null, error };
        }
    },

    async searchJobs(query: string) {
        try {
            const headers = await this.getHeaders();
            // Using PostgREST 'or' logic for simple search across multiple columns
            // Format: column.ilike.*value*,column.ilike.*value*
            const searchFilter = `or=(title.ilike.*${query}*,company_name.ilike.*${query}*,description.ilike.*${query}*)`;

            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&${searchFilter}&order=created_at.desc`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                return { data: [], error: 'Search failed' };
            }
            const data = await response.json();
            return { data, error: null };
        } catch (error: any) {
            console.error("Search Error:", error);
            return { data: [], error };
        }
    },
    async recordJobView(jobId: string, userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/recently_viewed?on_conflict=user_id,job_id`, {
                method: 'POST',
                headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify({
                    user_id: userId,
                    job_id: jobId,
                    viewed_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                console.log("Record View Error", await response.text());
            }
            return { data: true, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async createJob(userId: string, jobData: any) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');
            const headers = await this.getHeaders();

            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    employer_id: userId,
                    title: jobData.title,
                    company_name: jobData.company,
                    location: jobData.location,
                    salary_range: jobData.salary,
                    job_type: jobData.schedule.employmentType,
                    description: jobData.description,
                    requirements: jobData.requirements,
                    skills: jobData.skills,
                    benefits: jobData.benefits,
                    hours_per_week: jobData.schedule.hoursPerWeek,
                    shift_preference: jobData.schedule.shiftPreference,
                    start_date: jobData.schedule.startDate,
                    is_flexible: jobData.schedule.isFlexible,
                    status: 'active'
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Create Job Failed: ${text}`);
            }

            return { success: true, error: null };
        } catch (error: any) {
            console.error("Create Job Error:", error);
            return { success: false, error };
        }
    },

    async getRecentlyViewedJobs(userId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/recently_viewed?user_id=eq.${userId}&select=viewed_at,job:jobs(*)&order=viewed_at.desc`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) throw new Error(await response.text());

            const data = await response.json();
            // Flatten the structure for easier consumption
            const recentJobs = data.map((item: any) => ({
                ...item.job,
                viewedAt: item.viewed_at // Keep the viewed timestamp
            }));

            return { data: recentJobs, error: null };
        } catch (error: any) {
            console.error("Get Recently Viewed Error:", error);
            return { data: [], error };
        }
    },

    async getEmployerDashboardStats(userId: string) {
        try {
            const token = await AsyncStorage.getItem('supabase_token');
            const headers = await this.getHeaders();

            // 1. Fetch all jobs for this employer
            const jobsResponse = await fetch(`${SUPABASE_URL}/rest/v1/jobs?employer_id=eq.${userId}&order=created_at.desc`, {
                method: 'GET',
                headers: headers
            });

            if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
            const jobs = await jobsResponse.json();

            if (jobs.length === 0) {
                return {
                    data: {
                        stats: { activeJobs: 0, totalApplicants: 0, newToday: 0 },
                        jobs: []
                    },
                    error: null
                };
            }

            // 2. Fetch all applications for these jobs
            const jobIds = jobs.map((j: any) => j.id).join(',');
            const appsResponse = await fetch(`${SUPABASE_URL}/rest/v1/applications?job_id=in.(${jobIds})&select=*,job:jobs(title)`, {
                method: 'GET',
                headers: headers
            });

            if (!appsResponse.ok) throw new Error("Failed to fetch applications");
            const applications = await appsResponse.json();

            // 3. Calculate Stats
            const activeJobs = jobs.filter((j: any) => j.status === 'active').length;
            const totalApplicants = applications.length;

            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const newToday = applications.filter((a: any) => new Date(a.created_at) > oneDayAgo).length;

            // 4. Map jobs with applicant counts
            const jobsWithStats = jobs.map((job: any) => {
                const jobApps = applications.filter((a: any) => a.job_id === job.id);
                const newApps = jobApps.filter((a: any) => new Date(a.created_at) > oneDayAgo).length;

                // Calculate days left (mock logic for now, or based on created_at + 30 days)
                const created = new Date(job.created_at);
                const expires = new Date(created);
                expires.setDate(created.getDate() + 30); // Assume 30 day listing
                const daysLeft = Math.ceil((expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

                return {
                    id: job.id,
                    title: job.title,
                    daysLeft: daysLeft > 0 ? `${daysLeft} days left` : 'Expired',
                    applicants: jobApps.length,
                    newApplicants: newApps,
                    status: job.status
                };
            });

            return {
                data: {
                    stats: { activeJobs, totalApplicants, newToday },
                    jobs: jobsWithStats
                },
                error: null
            };

        } catch (error: any) {
            console.error("Dashboard Stats Error:", error);
            return { data: null, error };
        }
    },
    async getApplicantsForEmployer(userId: string, jobId?: string) {
        try {
            console.log(`[getApplicantsForEmployer] v2 Fetching for userId: ${userId}, jobId: ${jobId || 'ALL'}`);
            const headers = await this.getHeaders();

            // Unified Query: Get applications where the related job belongs to the employer
            // and optionally matches a specific job ID.
            let queryUrl = `${SUPABASE_URL}/rest/v1/applications?select=*,job:jobs!inner(title,employer_id)&job.employer_id=eq.${userId}&order=created_at.desc`;

            if (jobId) {
                queryUrl += `&job_id=eq.${jobId}`;
            }

            const response = await fetch(queryUrl, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                console.error("Fetch Applicants Failed:", await response.text());
                throw new Error("Failed to fetch applications");
            }

            const applications = await response.json();
            console.log(`[getApplicantsForEmployer] Applications found: ${applications.length}`);

            if (applications.length === 0) return { data: [], error: null };

            // 3. Fetch Seeker Profiles (Keep this separate step as relations might be tricky)
            const seekerIds = [...new Set(applications.map((a: any) => a.applicant_id))];
            const profilesResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=in.(${seekerIds.join(',')})&select=*`, {
                method: 'GET',
                headers: headers
            });

            if (!profilesResponse.ok) throw new Error("Failed to fetch seeker profiles");
            const profiles = await profilesResponse.json();
            const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

            // 4. Merge Data
            const results = applications.map((app: any) => {
                const profile: any = profileMap.get(app.applicant_id) || {};
                // Job title comes from the join now
                const jobTitle = app.job?.title || 'Unknown Job';

                const matchScore = Math.floor(Math.random() * 30) + 70; // 70-99%

                return {
                    id: app.id,
                    name: profile.full_name || 'Anonymous Applicant',
                    title: profile.headline || 'Job Seeker',
                    appliedFor: jobTitle,
                    date: new Date(app.created_at).toLocaleDateString(),
                    status: app.status || 'New',
                    match: `${matchScore} % Match`,
                    avatarColor: '#2563EB',
                    avatarUrl: profile.avatar_url,
                    jobId: app.job_id,
                    seekerId: app.applicant_id
                };
            });

            console.log(`[getApplicantsForEmployer] Returning ${results.length} results`);
            return { data: results, error: null };

        } catch (error: any) {
            console.error("Get Applicants Error:", error);
            return { data: [], error };
        }
    },
    async updateApplicationStatus(applicationId: string, status: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/applications?id=eq.${applicationId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ status: status })
            });

            if (!response.ok) {
                console.error("Update Status Error:", await response.text());
                return { error: 'Failed to update status' };
            }

            return { data: true, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    },

    async scheduleInterview(applicationId: string, interviewDetails: any) {
        // ideally save to an 'interviews' table
        // for now, we just update the application status to 'interview'
        try {
            console.log("Scheduling interview for:", applicationId, interviewDetails);
            return await this.updateApplicationStatus(applicationId, 'interview');
        } catch (error) {
            return { error };
        }
    },

    async getMessages(applicationId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?application_id=eq.${applicationId}&order=created_at.asc`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const text = await response.text();
                // If table doesn't exist yet, return empty list gracefully to avoid crashes
                console.warn("Get Messages Error (likely table missing):", text);
                return { data: [], error: null };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: [], error };
        }
    },

    async getLastMessage(applicationId: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?application_id=eq.${applicationId}&order=created_at.desc&limit=1`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) return { data: null, error: 'Failed' };
            const data = await response.json();
            return { data: data[0] || null, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async sendMessage(applicationId: string, senderId: string, content: string) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    application_id: applicationId,
                    sender_id: senderId,
                    content: content
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Send Message Error:", text);
                return { error: text };
            }

            const data = await response.json(); // Usually returns null for 201 Created unless Prefer: return=representation
            return { data, error: null };
        } catch (error) {
            return { error };
        }
    },

    async getEmployerChats(userId: string) {
        try {
            const headers = await this.getHeaders();

            // 1. Get jobs for this employer
            const jobsResponse = await fetch(`${SUPABASE_URL}/rest/v1/jobs?employer_id=eq.${userId}&select=id,title`, {
                method: 'GET',
                headers: headers
            });

            if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
            const jobs = await jobsResponse.json();
            console.log("Debug Employer Chats - Jobs Found:", jobs.length);

            if (!jobs || jobs.length === 0) {
                return { data: [], profiles: new Map(), error: null };
            }

            const jobIds = jobs.map((j: any) => j.id);

            // 2. Get applications for these jobs
            // We join with jobs to get the title easily
            const appsResponse = await fetch(`${SUPABASE_URL}/rest/v1/applications?job_id=in.(${jobIds.join(',')})&select=*,job:jobs(title)`, {
                method: 'GET',
                headers: headers
            });

            if (!appsResponse.ok) throw new Error("Failed to fetch applications");
            const applications = await appsResponse.json();
            console.log("Debug Employer Chats - Applications Found:", applications.length);

            if (!applications || applications.length === 0) {
                return { data: [], profiles: new Map(), error: null };
            }

            // 3. Get profiles of applicants
            const seekerIds = [...new Set(applications.map((app: any) => app.applicant_id))];
            const profilesResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=in.(${seekerIds.join(',')})&select=*`, {
                method: 'GET',
                headers: headers
            });

            if (!profilesResponse.ok) throw new Error("Failed to fetch profiles");
            const profilesData = await profilesResponse.json();

            // Create a Map for easy lookup
            const profilesMap = new Map();
            profilesData.forEach((p: any) => profilesMap.set(p.id, p));

            return { data: applications, profiles: profilesMap, error: null };

        } catch (error: any) {
            console.error("Get Employer Chats Error:", error);
            return { data: [], profiles: new Map(), error };
        }
    }
};
