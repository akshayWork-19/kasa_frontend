import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const MyBookings = () => {

    const navigate = useNavigate();
    const { data: bookings, loading, error } = useFetch('/bookings/my');

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const getNights = (start, end) =>
        Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

    const getStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (now < start) return { label: 'Upcoming', color: '#2563eb', bg: '#eff6ff' };
        if (now >= start && now <= end) return { label: 'Active', color: '#16a34a', bg: '#f0fdf4' };
        return { label: 'Completed', color: '#64748b', bg: '#f1f5f9' };
    };

    return (
        <div style={styles.page}>
            <div className="container" style={styles.container}>
                <h1 style={styles.title}>My Bookings</h1>

                {loading && <Loader message="Loading bookings..." />}

                {error && !loading && (
                    <div style={styles.errorBox}>{error}</div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="card-base" style={styles.empty}>
                        <p style={{ fontSize: '56px' }}>📋</p>
                        <p style={{ fontWeight: '600', fontSize: '18px', color: '#1e293b' }}>No bookings yet</p>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Head to the dashboard to book a room!</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            Explore Rooms
                        </button>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="grid-auto" style={styles.list}>
                        {bookings.map((b) => {
                            const status = getStatus(b.start_date, b.end_date);
                            const nights = getNights(b.start_date, b.end_date);
                            return (
                                <div key={b.id} className="card-base" style={styles.card}>
                                    <img
                                        src={b.image_url || 'https://via.placeholder.com/120x90'}
                                        alt={b.room_name}
                                        style={styles.img}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/120x90'; }}
                                    />
                                    <div style={styles.body}>
                                        <div style={styles.row}>
                                            <h3 style={styles.roomName}>{b.room_name}</h3>
                                            <span style={{ ...styles.badge, color: status.color, background: status.bg }}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div style={styles.dates}>
                                            <div>
                                                <div style={styles.dateLabel}>Check-in</div>
                                                <div style={styles.dateVal}>{formatDate(b.start_date)}</div>
                                            </div>
                                            <div style={styles.arrow}>→</div>
                                            <div>
                                                <div style={styles.dateLabel}>Check-out</div>
                                                <div style={styles.dateVal}>{formatDate(b.end_date)}</div>
                                            </div>
                                        </div>
                                        <div style={styles.footer}>
                                            <span style={styles.nights}>{nights} night{nights > 1 ? 's' : ''}</span>
                                            <span style={styles.price}>Total: <strong>${parseFloat(b.total_price).toFixed(2)}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', background: '#f1f5f9', padding: '40px 0' },
    container: { maxWidth: '860px', margin: '0 auto', padding: '0 24px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '32px' },
    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: {
        background: '#fff', borderRadius: '16px',
        display: 'flex', gap: '20px',
        padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
    },
    img: { width: '120px', height: '90px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 },
    body: { flex: 1 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    roomName: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' },
    badge: {
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700',
    },
    dates: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' },
    dateLabel: { fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' },
    dateVal: { fontSize: '14px', fontWeight: '600', color: '#334155' },
    arrow: { color: '#94a3b8', fontSize: '18px' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    nights: { fontSize: '13px', color: '#64748b' },
    price: { fontSize: '15px', color: '#1e293b' },
    errorBox: { background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '10px', textAlign: 'center' },
    empty: { textAlign: 'center', padding: '80px 0', color: '#64748b' },
};

export default MyBookings;