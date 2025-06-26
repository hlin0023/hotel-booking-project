import React from 'react';
import { format } from 'date-fns';

export default function RoomDashboard({ availability, selectedDate, onDateChange }) {
  return (
    <div className="dashboard">
      <h2>Availability for {format(selectedDate, 'MMM dd, yyyy')}</h2>
      
      <div className="date-picker">
        <label>Select Date: </label>
        <input 
          type="date" 
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={e => onDateChange(new Date(e.target.value))}
        />
      </div>
      
      <div className="room-stats">
        <div className="room-type">
          <h3>Single Rooms (101-107)</h3>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">{availability.single.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat">
              <div className="stat-value booked">{availability.single.booked}</div>
              <div className="stat-label">Booked</div>
            </div>
            <div className="stat">
              <div className="stat-value vacant">{availability.single.vacant}</div>
              <div className="stat-label">Vacant</div>
            </div>
          </div>
          <div className="room-list">
            <h4>Room Status:</h4>
            <div className="room-status-grid">
              {availability.single.rooms.map(room => (
                <div 
                  key={room.number} 
                  className={`room-status ${room.isBooked ? 'booked' : 'available'}`}
                >
                  {room.number}: {room.isBooked ? 'Booked' : 'Available'}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="room-type">
          <h3>Double Rooms (201-203)</h3>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">{availability.double.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat">
              <div className="stat-value booked">{availability.double.booked}</div>
              <div className="stat-label">Booked</div>
            </div>
            <div className="stat">
              <div className="stat-value vacant">{availability.double.vacant}</div>
              <div className="stat-label">Vacant</div>
            </div>
          </div>
          <div className="room-list">
            <h4>Room Status:</h4>
            <div className="room-status-grid">
              {availability.double.rooms.map(room => (
                <div 
                  key={room.number} 
                  className={`room-status ${room.isBooked ? 'booked' : 'available'}`}
                >
                  {room.number}: {room.isBooked ? 'Booked' : 'Available'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}