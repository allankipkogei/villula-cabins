import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatKSh } from '../utils/formatCurrency';

export default function CabinList() {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('cabins/')
      .then(res => setCabins(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading cabins…</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Our Cabins</h1>
      {cabins.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sanctuary Reservations Opening Soon</p>
          <p style={{ color: '#666' }}>Units will be listed here as soon as reservations officially open.</p>
          <Link to="/contact">Contact Concierge →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {cabins.map(cabin => (
            <div key={cabin.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              {cabin.primary_image && (
                <img src={cabin.primary_image} alt={cabin.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '1rem' }}>
                <h2>{cabin.name}</h2>
                <p>{formatKSh(cabin.price_per_night)} / night</p>
                <p>Sleeps up to {cabin.max_guests} guests</p>
                <Link to={`/cabins/${cabin.slug}`}>View details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
