import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/services/supabase.frontend.service';

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchProfile();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? `/api/volunteer/notifications?userId=${user?.id}`
        : `http://localhost:4000/api/volunteer/notifications?userId=${user?.id}`;
      
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchProfile = async () => {
      const { data } = await supabase.from('volunteers').select('*').eq('user_id', user?.id).single();
      if (data) {
          setLocation({ lat: data.location_lat, lng: data.location_lng, address: data.location_address || '' });
      }
  };

  const handleUpdateLocation = async () => {
      const address = prompt("Enter your location (City/Area):", location.address);
      if (address) {
          try {
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? '/api/volunteer/location'
                : 'http://localhost:4000/api/volunteer/location';

            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    address,
                    lat: 0, // Mock
                    lng: 0  // Mock
                })
            });
            fetchProfile();
            alert("Location updated!");
          } catch (e) {
              console.error(e);
          }
      }
  };

  if (!user) return <div className="pt-32 text-center">Please log in to view dashboard.</div>;

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Volunteer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <p className="text-gray-600 mb-2"><strong>Name:</strong> {user.email}</p>
            <p className="text-gray-600 mb-4"><strong>Location:</strong> {location.address || 'Not set'}</p>
            <button 
                onClick={handleUpdateLocation}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
                Update Location
            </button>
        </div>

        {/* Notifications */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-500">No new notifications.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 rounded-xl border ${notif.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                            <h3 className="font-bold text-lg">{notif.title}</h3>
                            <p className="text-gray-700">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
