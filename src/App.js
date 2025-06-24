import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Dumbbell, Zap, Target, Award, TrendingUp, X, Plus, Star, Footprints, UserCircle, LogOut, Trophy, Pencil, Check, BookOpen, Search, ChevronDown, BarChart3, CalendarCheck2, Users, Shield, Menu, BrainCircuit, HeartPulse, Clock } from 'lucide-react';
import { auth, db, appId } from './api/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, addDoc, collection, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// --- API & DATA IMPORTS ---
import { exerciseLibrary } from './data/exerciseLibrary';
import { workoutPlans } from './data/workoutPlans';
import { leagues, getLeagueForXp } from './data/leagues';

// --- COMPONENT IMPORTS ---
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import LogActivityModal from './components/LogActivityModal';
import Dashboard from './pages/Dashboard';
import WorkoutsPage from './pages/WorkoutsPage';
import LeaguesPage from './pages/LeaguesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CalculatorsPage from './pages/CalculatorsPage';

const activityTypes = [
    { name: 'Running', icon: Footprints, avgXp: 50 },
    { name: 'Weightlifting', icon: Dumbbell, avgXp: 40 },
    { name: 'Yoga', icon: Zap, avgXp: 25 },
    { name: 'Cycling', icon: Zap, avgXp: 45 },
    { name: 'Swimming', icon: Zap, avgXp: 55 },
    { name: 'Walking', icon: Footprints, avgXp: 20 },
];

// Helper: Calculate level and progress from cumulative XP
function getLevelFromXp(xp) {
    let level = 1;
    let xpForNext = 100;
    let totalForNext = 100;
    while (xp >= totalForNext) {
        level++;
        xpForNext = Math.floor(100 * Math.pow(1.5, level - 1));
        totalForNext += xpForNext;
    }
    return level;
}

function getXpProgress(xp) {
    let level = 1;
    let xpForNext = 100;
    let totalForNext = 100;
    let prevTotal = 0;
    while (xp >= totalForNext) {
        level++;
        prevTotal = totalForNext;
        xpForNext = Math.floor(100 * Math.pow(1.5, level - 1));
        totalForNext += xpForNext;
    }
    return {
        level,
        xpInLevel: xp - prevTotal,
        xpToNextLevel: xpForNext,
        progress: ((xp - prevTotal) / xpForNext) * 100
    };
}

// --- MAIN APP COMPONENT ---
export default function App() {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [userData, setUserData] = useState({ level: 1, xp: 0, streak: 0, lastActivityDate: null, name: 'Fitness Warrior', activePlan: null, dailyTaskXp: 0, league: 'Iron Division' });
    const [workouts, setWorkouts] = useState([]);
    const [dailyCompletion, setDailyCompletion] = useState({});
    const [leagueRoster, setLeagueRoster] = useState([]);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [logError, setLogError] = useState(null);

    useEffect(() => {
        document.title = "FitQuest";
        const favicon = document.querySelector("link[rel~='icon']");
        if (favicon) {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
            favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setIsAuthReady(true);
            }
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (!user) {
            setIsAuthReady(true);
            return;
        };

        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const { level, xpInLevel, xpToNextLevel, progress } = getXpProgress(data.xp || 0);
                const currentLeague = getLeagueForXp(data.xp || 0);
                const updatedData = {
                    level,
                    xp: data.xp || 0,
                    xpInLevel,
                    xpToNextLevel,
                    xpProgress: progress,
                    streak: data.streak || 0,
                    lastActivityDate: data.lastActivityDate?.toDate(),
                    name: data.name || user.displayName || 'Fitness Warrior',
                    activePlan: data.activePlan || null,
                    dailyTaskXp: data.dailyTaskXp || 0,
                    league: currentLeague.name,
                };
                setUserData(updatedData);
                if (data.league !== currentLeague.name) {
                    updateDoc(userDocRef, { league: currentLeague.name });
                }
            } else {
                const initialLeague = getLeagueForXp(0);
                setDoc(userDocRef, {
                    level: 1, xp: 0, streak: 0, name: user.displayName || 'Fitness Warrior',
                    createdAt: serverTimestamp(), email: user.email, activePlan: null, dailyTaskXp: 0, league: initialLeague.name
                });
            }
            setIsAuthReady(true);
        });

        const workoutsColRef = collection(db, 'artifacts', appId, 'users', user.uid, 'workouts');
        const q = query(workoutsColRef);
        const unsubscribeWorkouts = onSnapshot(q, (querySnapshot) => {
            const workoutsData = [];
            querySnapshot.forEach((doc) => {
                workoutsData.push({ id: doc.id, ...doc.data() });
            });
            workoutsData.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
            setWorkouts(workoutsData);
        });
        
        const today = new Date().toISOString().slice(0, 10);
        const dailyProgressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyProgress', today);
        const unsubscribeDaily = onSnapshot(dailyProgressRef, (docSnap) => {
            if (docSnap.exists()) {
                setDailyCompletion(docSnap.data());
            } else {
                setDailyCompletion({});
            }
        });

        return () => {
            unsubscribeUser();
            unsubscribeWorkouts();
            unsubscribeDaily();
        };
    }, [user]);
    
    useEffect(() => {
        if (currentView === 'leagues' && userData.league) {
            const fetchLeagueRoster = async () => {
                const usersColRef = collection(db, 'artifacts', appId, 'users');
                const q = query(usersColRef, where('league', '==', userData.league));
                try {
                    const querySnapshot = await getDocs(q);
                    const roster = [];
                    querySnapshot.forEach(doc => {
                        roster.push({ id: doc.id, ...doc.data() });
                    });
                    roster.sort((a, b) => {
                        if (b.level !== a.level) {
                            return b.level - a.level;
                        }
                        return b.xp - a.xp;
                    });
                    setLeagueRoster(roster);
                } catch (error) {
                    console.error("Error fetching league roster:", error);
                }
            };
            fetchLeagueRoster();
        }
    }, [currentView, userData.league]);


    const xpToNextLevel = userData.xpToNextLevel || 100;
    const xpProgress = userData.xpProgress || 0;
    
    useEffect(() => {
        if (!userData.lastActivityDate || !user) return;
        const today = new Date();
        const lastDate = new Date(userData.lastActivityDate);
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);
        const diffTime = today - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1 && userData.streak > 0) {
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            updateDoc(userDocRef, { streak: 0 });
        }
        if (diffDays >= 1) {
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            updateDoc(userDocRef, { dailyTaskXp: 0 });
        }
    }, [userData.lastActivityDate, userData.streak, user]);

    const handleUpdateName = async (newName) => {
        if (!user || !newName.trim()) return;
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { name: newName.trim() });
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handleLogActivity = async (activity) => {
        if (!user) return;
        setLogError(null);
        const cappedDuration = Math.min(activity.duration, 240);
        const baseXP = activityTypes.find(a => a.name === activity.type)?.avgXp || 30;
        const calculatedXp = Math.ceil(baseXP * (cappedDuration / 30));
        const newXp = (userData.xp || 0) + calculatedXp;
        const { level } = getXpProgress(newXp);
        let newStreak = userData.streak;
        const today = new Date();
        const lastDate = userData.lastActivityDate ? new Date(userData.lastActivityDate) : null;
        today.setHours(0, 0, 0, 0);
        if (!lastDate) {
            newStreak = 1;
        } else {
            lastDate.setHours(0, 0, 0, 0);
            const isSameDay = today.getTime() === lastDate.getTime();
            if (!isSameDay) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const isConsecutiveDay = yesterday.getTime() === lastDate.getTime();
                newStreak = isConsecutiveDay ? userData.streak + 1 : 1;
            }
        }
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        const workoutsColRef = collection(db, 'artifacts', appId, 'users', user.uid, 'workouts');
        try {
            await addDoc(workoutsColRef, { ...activity, xp: calculatedXp, timestamp: serverTimestamp() });
            await updateDoc(userDocRef, {
                level,
                xp: newXp,
                streak: newStreak,
                lastActivityDate: serverTimestamp(),
            });
            setIsLogModalOpen(false);
        } catch (error) {
            console.error("Error logging activity:", error);
            setLogError("Failed to log activity. Please check permissions in Firebase Console.");
        }
    };
    
    const quests = useMemo(() => [
        { id: 1, icon: Dumbbell, text: "Log any workout", completed: workouts.length > 0 },
        { id: 2, icon: Footprints, text: "Log a 30+ minute activity", completed: workouts.some(w => w.duration >= 30) },
    ], [workouts]);

    const handleSelectPlan = async (planName) => {
        if (!user) return;
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { activePlan: planName });
            setCurrentView('dashboard');
        } catch (error) {
            console.error("Error selecting plan:", error);
        }
    };
    
    const handleMarkDone = async (exerciseId) => {
        if (!user || dailyCompletion[exerciseId] || userData.dailyTaskXp >= 50) return;
        const today = new Date().toISOString().slice(0, 10);
        const dailyProgressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyProgress', today);
        try {
            await setDoc(dailyProgressRef, { [exerciseId]: true }, { merge: true });
            const xpFromTask = 5;
            const newDailyTaskXp = userData.dailyTaskXp + xpFromTask;
            const newXp = (userData.xp || 0) + xpFromTask;
            const { level } = getXpProgress(newXp);
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            await updateDoc(userDocRef, {
                xp: newXp,
                level,
                dailyTaskXp: newDailyTaskXp
            });
        } catch (error) {
            console.error("Error marking exercise as done:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    if (!isAuthReady) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <Zap className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                    <h1 className="text-2xl font-bold mt-4">Connecting to FitQuest...</h1>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return <LoginScreen onGoogleSignIn={handleGoogleSignIn} />;
    }

    if (!userData) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <Zap className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                    <h1 className="text-2xl font-bold mt-4">Loading your data...</h1>
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch(currentView) {
            case 'dashboard':
                return <Dashboard 
                            userData={userData} 
                            xpProgress={xpProgress} 
                            xpToNextLevel={xpToNextLevel} 
                            quests={quests}
                            workouts={workouts} 
                            dailyCompletion={dailyCompletion} 
                            onMarkDone={handleMarkDone}
                            setIsLogModalOpen={setIsLogModalOpen}
                            onUpdateName={handleUpdateName}
                        />;
            case 'workouts':
                return <WorkoutsPage 
                    userData={userData}
                    dailyCompletion={dailyCompletion}
                    onMarkDone={handleMarkDone}
                    xpProgress={xpProgress}
                    xpToNextLevel={xpToNextLevel}
                    quests={quests}
                    workouts={workouts}
                    setIsLogModalOpen={setIsLogModalOpen}
                    onUpdateName={handleUpdateName}
                />;
            case 'leagues':
                return <LeaguesPage currentUserId={user.uid} userData={userData} leagueRoster={leagueRoster} />;
            case 'analytics':
                 return <AnalyticsPage workouts={workouts} />;
            case 'calculators':
                 return <CalculatorsPage />;
            default:
                return <Dashboard 
                            userData={userData} 
                            xpProgress={xpProgress} 
                            xpToNextLevel={xpToNextLevel} 
                            quests={quests}
                            workouts={workouts} 
                            dailyCompletion={dailyCompletion} 
                            onMarkDone={handleMarkDone}
                            setIsLogModalOpen={setIsLogModalOpen}
                            onUpdateName={handleUpdateName}
                        />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header userData={userData} setCurrentView={setCurrentView} currentView={currentView} onSignOut={handleSignOut} />
            <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {renderView()}
            </main>
            {isLogModalOpen && <LogActivityModal onClose={() => setIsLogModalOpen(false)} onLog={handleLogActivity} error={logError} activityTypes={activityTypes} />}
            <footer className="text-center p-4 text-gray-500 text-xs">
                FitQuest App | User ID: {user.uid}
            </footer>
        </div>
    );
}

// Minimal CSS for animations (Tailwind handles the rest)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    
    @keyframes fadeInFast { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in-fast { animation: fadeInFast 0.3s ease-out forwards; }

    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }

    /* Custom scrollbar for activity feed */
    .overflow-y-auto::-webkit-scrollbar { width: 8px; }
    .overflow-y-auto::-webkit-scrollbar-track { background: #1f2937; /* gray-800 */ }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #374151; /* gray-700 */ border-radius: 4px; }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #4b5563; /* gray-600 */ }
`;
document.head.appendChild(style);
