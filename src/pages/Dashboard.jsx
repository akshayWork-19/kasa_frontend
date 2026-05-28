import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";

const Dashboard = () => {
    const { user } = useAuth();
    const { data: rooms, loading, error } = useFetch('/rooms');

    return (
        <div className="dashboard-page" style={styles.page}>
            <div className="hero-section" style={styles.hero}>
                <h1 className="hero-title" style={styles.heroTitle}>Welcome back, {user?.name}! 👋</h1>
                <p className="hero-sub" style={styles.heroSub}>Browse our available rooms and book your perfect stay.</p>
            </div>

            <div className="container" style={styles.container}>
                {loading && <Loader message="Loading rooms..." />}

                {error && !loading && (
                    <div style={styles.errorBox}>{error}</div>
                )}

                {!loading && !error && rooms.length === 0 && (
                    <div style={styles.empty}>
                        <p style={{ fontSize: '48px' }}>🏨</p>
                        <p>No rooms available at the moment.</p>
                    </div>
                )}

                {!loading && !error && rooms.length > 0 && (
                    <>
                        <h2 style={styles.sectionTitle}>Available Rooms ({rooms.length})</h2>
                        <div className="grid-auto" style={styles.grid}>
                            {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


const styles = {
    page: { minHeight: '100vh', background: '#f1f5f9' },
    hero: {
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        padding: '48px 32px', textAlign: 'center',
    },
    heroTitle: { color: '#f8fafc', fontSize: '32px', fontWeight: '800', margin: '0 0 8px' },
    heroSub: { color: '#94a3b8', fontSize: '16px', margin: 0 },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
    sectionTitle: { fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '28px',
    },
    errorBox: {
        background: '#fef2f2', color: '#dc2626', padding: '16px',
        borderRadius: '10px', textAlign: 'center',
    },
    empty: {
        textAlign: 'center', color: '#64748b', padding: '80px 0', fontSize: '16px',
    },
};

export default Dashboard;