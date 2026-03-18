import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BookingForm from '../components/BookingForm';
import Loader from "../components/Loader";


const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/rooms/${id}`);
                setRoom(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Room not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) return <div style={{ padding: '80px' }}><Loader /></div>;

    if (error) return (
        <div style={styles.errorPage}>
            <p style={{ fontSize: '48px' }}>😕</p>
            <p style={{ color: '#dc2626', fontWeight: '600' }}>{error}</p>
            <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Rooms</button>
        </div>
    );

    return (
        <div className="dashboard-page" style={styles.page}>
            <div className="container" style={styles.container}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={styles.back}>← Back to Rooms</button>

                <div className="details-layout" style={styles.layout}>
                    {/* Left: Room Info */}
                    <div className="card-base" style={styles.left}>
                        <img
                            src={room.image_url || 'https://via.placeholder.com/800x450'}
                            alt={room.name}
                            style={styles.img}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450'; }}
                        />
                        <div style={styles.info}>
                            <h1 style={styles.title}>{room.name}</h1>
                            <div className="flex-between" style={styles.meta}>
                                <span style={styles.price}>${room.price_per_night}<span style={styles.perNight}> / night</span></span>
                                <span className="nav-user" style={styles.badge}>👥 Up to {room.capacity} guests</span>
                            </div>
                            <p style={styles.desc}>{room.description}</p>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="details-right" style={styles.right}>
                        <BookingForm room={room} />
                    </div>
                </div>
            </div>
        </div>
    );
};



const styles = {
    page: { minHeight: '100vh', background: '#f1f5f9', padding: '32px 0' },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
    back: {
        background: 'none', border: 'none', color: '#2563eb',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
        marginBottom: '24px', padding: 0,
    },
    layout: {
        display: 'grid', gridTemplateColumns: '1fr 380px',
        gap: '32px', alignItems: 'start',
    },
    left: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
    img: { width: '100%', height: '320px', objectFit: 'cover', display: 'block' },
    info: { padding: '28px' },
    title: { margin: '0 0 16px', fontSize: '26px', fontWeight: '800', color: '#1e293b' },
    meta: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
    price: { fontSize: '26px', fontWeight: '800', color: '#2563eb' },
    perNight: { fontSize: '15px', color: '#94a3b8', fontWeight: '400' },
    badge: {
        background: '#f1f5f9', color: '#475569', padding: '6px 14px',
        borderRadius: '20px', fontSize: '13px', fontWeight: '600',
    },
    desc: { color: '#64748b', lineHeight: '1.7', fontSize: '15px', margin: 0 },
    right: {},
    errorPage: {
        textAlign: 'center', padding: '80px', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    },
    backBtn: {
        marginTop: '16px', background: '#2563eb', color: '#fff',
        border: 'none', padding: '12px 24px', borderRadius: '10px',
        cursor: 'pointer', fontWeight: '600',
    },
};

export default RoomDetails;