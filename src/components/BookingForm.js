import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

export default function BookingForm({ onBookRoom, calculateAvailability }) {
  const [formData, setFormData] = useState({
    roomType: 'single',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    guestName: '',
    guestEmail: '',
    roomNumber: null
  });
  
  const [availability, setAvailability] = useState({
    availableRooms: [],
    selectedRoom: null
  });
  
  const [message, setMessage] = useState('');

  // Update availability when dates or room type changes
  useEffect(() => {
    checkAvailability();
  }, [formData.checkIn, formData.checkOut, formData.roomType]);

  const checkAvailability = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setMessage('Please select dates');
      return;
    }
    
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setMessage('Check-out must be after check-in');
      return;
    }

    const currentAvailability = calculateAvailability(formData.checkIn, formData.checkOut);
    const availableRooms = currentAvailability[formData.roomType].rooms
      .filter(room => !room.isBooked);

    setAvailability({
      availableRooms,
      selectedRoom: null
    });
    
    setMessage(availableRooms.length > 0 
      ? `${availableRooms.length} ${formData.roomType} room(s) available!` 
      : `No ${formData.roomType} rooms available for these dates`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!availability.selectedRoom) {
      setMessage('Please select a room');
      return;
    }

    const result = onBookRoom({
      ...formData,
      roomNumber: availability.selectedRoom.number
    });
    
    setMessage(result.message);
    
    if (result.success) {
      setFormData({
        roomType: 'single',
        checkIn: format(new Date(), 'yyyy-MM-dd'),
        checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        guestName: '',
        guestEmail: '',
        roomNumber: null
      });
      setAvailability({
        availableRooms: [],
        selectedRoom: null
      });
    }
  };

  return (
    <div className="booking-form">
      <h2>Book a Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Type:</label>
          <select
            value={formData.roomType}
            onChange={e => setFormData({
              ...formData, 
              roomType: e.target.value,
              roomNumber: null
            })}
          >
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Check-in:</label>
          <input
            type="date"
            value={formData.checkIn}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={e => setFormData({
              ...formData, 
              checkIn: e.target.value,
              roomNumber: null
            })}
          />
        </div>
        
        <div className="form-group">
          <label>Check-out:</label>
          <input
            type="date"
            value={formData.checkOut}
            min={formData.checkIn}
            onChange={e => setFormData({
              ...formData, 
              checkOut: e.target.value,
              roomNumber: null
            })}
          />
        </div>
        
        <div className="availability-display">
          <div className="available-rooms">
            {availability.availableRooms.length > 0 && (
              <>
                <h4>Available Rooms:</h4>
                <div className="room-buttons">
                  {availability.availableRooms.map(room => (
                    <button
                      type="button"
                      key={room.number}
                      className={`room-btn ${availability.selectedRoom?.number === room.number ? 'selected' : ''}`}
                      onClick={() => setAvailability(prev => ({
                        ...prev,
                        selectedRoom: room
                      }))}
                    >
                      Room {room.number}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {availability.selectedRoom && (
          <div className="guest-details">
            <div className="form-group">
              <label>Guest Name:</label>
              <input
                type="text"
                value={formData.guestName}
                onChange={e => setFormData({
                  ...formData, 
                  guestName: e.target.value
                })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Guest Email:</label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={e => setFormData({
                  ...formData, 
                  guestEmail: e.target.value
                })}
                required
              />
            </div>
            
            <button type="submit" className="btn book-btn">
              Book Room {availability.selectedRoom.number}
            </button>
          </div>
        )}
        
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : ''}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}