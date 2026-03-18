import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    return (
        <div className="card-base" style={styles.card}>
            <img
                src={room.image_url || 'https://via.placeholder.com/400x220'}
                alt={room.name}
                style={styles.img}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x220'; }}
            />
            <div style={styles.body}>
                <h3 style={styles.title}>{room.name}</h3>
                <p style={styles.desc}>{room.description || 'A comfortable and well-equipped room.'}</p>
                <div style={styles.footer}>
                    <div>
                        <span style={styles.price}>${room.price_per_night}</span>
                        <span style={styles.night}> / night</span>
                    </div>
                    <span style={styles.capacity}>👥 Up to {room.capacity} guests</span>
                </div>
                <button className="btn btn-primary" style={styles.btn} onClick={() => navigate(`/rooms/${room.id}`)}>
                    View & Book
                </button>
            </div>
        </div>
    )
}


const styles = {
    card: {
        background: '#fff', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    img: { width: '100%', height: '200px', objectFit: 'cover', display: 'block' },
    body: { padding: '20px' },
    title: { margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
    desc: { color: '#64748b', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    price: { fontSize: '22px', fontWeight: '800', color: '#2563eb' },
    night: { color: '#94a3b8', fontSize: '14px' },
    capacity: { fontSize: '13px', color: '#64748b' },
    btn: {
        width: '100%', background: '#2563eb', color: '#fff',
        border: 'none', padding: '12px', borderRadius: '10px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    },
};

export default RoomCard;