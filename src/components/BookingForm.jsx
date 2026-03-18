import { useState } from "react";
import api from '../api/axios';

const BookingForm = ({ room }) => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [nights, setNights] = useState(0);

    const today = new Date().toISOString().split('T')[0];

    const calculateNights = (start, end) => {
        if (!start || !end) return 0;
        const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
        return diff > 0 ? diff : 0;
    }

    const handleDateChange = (type, value) => {
        const newStart = type === 'start' ? value : startDate;
        const newEnd = type === 'end' ? value : endDate;
        if (type === 'start') setStartDate(value);
        else setEndDate(value);
        setNights(calculateNights(newStart, newEnd));
        setAvailability(null);
        setStatus(null);
    }

    const checkAvailability = async () => {
        if (!startDate || !endDate) {
            setStatus({ type: 'error', message: 'Please select both dates first.' });
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setStatus({ type: 'error', message: 'End date must be after start date.' });
            return;
        }

        setLoading(true);

        try {
            const res = await api.get('/bookings/check-availability', {
                params: { roomId: room.id, startDate, endDate }
            });

            setAvailability(res.data.data.available);
            setStatus(null);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to check availability.' });
        } finally {
            setLoading(false);
        }
    }

    const handleBook = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await api.post('/bookings', {
                roomId: room.id,
                startDate,
                endDate,
            });
            setStatus({ type: 'success', message: `🎉 Booking confirmed! Total: $${res.data.data.totalPrice}` });
            setStartDate('');
            setEndDate('');
            setNights(0);
            setAvailability(null);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Booking failed. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-base" style={styles.form}>
            <h3 style={styles.heading}>Book This Room</h3>

            <div style={styles.field}>
                <label className="label-base" style={styles.label}>Check-in Date</label>
                <input
                    type="date"
                    min={today}
                    className="input-field"
                    value={startDate}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.field}>
                <label className="label-base" style={styles.label}>Check-out Date</label>
                <input
                    type="date"
                    min={startDate || today}
                    className="input-field"
                    value={endDate}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    style={styles.input}
                />
            </div>

            {nights > 0 && (
                <div style={styles.summary}>
                    <span>{nights} night{nights > 1 ? 's' : ''} × ${room.price_per_night}</span>
                    <strong>= ${(nights * room.price_per_night).toFixed(2)}</strong>
                </div>
            )}

            {availability === null ? (
                <button onClick={checkAvailability} className="btn btn-outline" style={styles.checkBtn} disabled={loading}>
                    {loading ? 'Checking...' : 'Check Availability'}
                </button>
            ) : availability ? (
                <>
                    <div style={styles.available}>✅ Room is available!</div>
                    <button onClick={handleBook} className="btn btn-primary" style={styles.bookBtn} disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </>
            ) : (
                <>
                    <div style={styles.unavailable}>❌ Room is unavailable for these dates.</div>
                    <button onClick={() => { setAvailability(null); setStartDate(''); setEndDate(''); }} className="btn btn-outline" style={styles.checkBtn}>
                        Choose Different Dates
                    </button>
                </>
            )}

            {status && (
                <div style={status.type === 'success' ? styles.successMsg : styles.errorMsg}>
                    {status.message}
                </div>
            )}
        </div>
    );
}


const styles = {
    form: {
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '16px', padding: '28px',
    },
    heading: { margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#1e293b' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    input: {
        width: '100%', padding: '10px 14px', borderRadius: '8px',
        border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box',
        outline: 'none',
    },
    summary: {
        display: 'flex', justifyContent: 'space-between',
        background: '#eff6ff', padding: '12px 16px', borderRadius: '8px',
        marginBottom: '16px', fontSize: '15px', color: '#1e40af',
    },
    checkBtn: {
        width: '100%', background: '#f1f5f9', color: '#334155',
        border: '1px solid #cbd5e1', padding: '12px',
        borderRadius: '10px', fontSize: '15px', fontWeight: '600',
        cursor: 'pointer', marginBottom: '12px',
    },
    bookBtn: {
        width: '100%', background: '#16a34a', color: '#fff',
        border: 'none', padding: '12px', borderRadius: '10px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px',
    },
    available: {
        color: '#16a34a', fontWeight: '600', marginBottom: '12px',
        background: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center',
    },
    unavailable: {
        color: '#dc2626', fontWeight: '600', marginBottom: '12px',
        background: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center',
    },
    successMsg: {
        background: '#f0fdf4', color: '#15803d', padding: '14px',
        borderRadius: '10px', fontWeight: '600', textAlign: 'center',
    },
    errorMsg: {
        background: '#fef2f2', color: '#dc2626', padding: '14px',
        borderRadius: '10px', fontWeight: '600', textAlign: 'center',
    },
};

export default BookingForm;
