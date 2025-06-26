import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import RoomDashboard from './components/RoomDashboard';
import BookingForm from './components/BookingForm';
import './App.css';

function App() {
  // Initialize rooms with proper numbering
  const initialRooms = [
    { roomNumber: 101, roomType: 'single', bookings: [] },
    { roomNumber: 102, roomType: 'single', bookings: [] },
    { roomNumber: 103, roomType: 'single', bookings: [] },
    { roomNumber: 104, roomType: 'single', bookings: [] },
    { roomNumber: 105, roomType: 'single', bookings: [] },
    { roomNumber: 106, roomType: 'single', bookings: [] },
    { roomNumber: 107, roomType: 'single', bookings: [] },
    { roomNumber: 201, roomType: 'double', bookings: [] },
    { roomNumber: 202, roomType: 'double', bookings: [] },
    { roomNumber: 203, roomType: 'double', bookings: [] }
  ];

  const [rooms, setRooms] = useState(initialRooms);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Improved availability calculation with date range checking
  const calculateAvailability = (checkIn, checkOut) => {
    const isRoomBooked = (room) => {
      return room.bookings.some(booking => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        const requestedStart = new Date(checkIn);
        const requestedEnd = new Date(checkOut);
        
        return (
          (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
          (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
          (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
        );
      });
    };

    const singleRooms = rooms.filter(r => r.roomType === 'single');
    const doubleRooms = rooms.filter(r => r.roomType === 'double');

    return {
      single: {
        total: singleRooms.length,
        booked: singleRooms.filter(r => isRoomBooked(r, checkIn, checkOut)).length,
        vacant: singleRooms.length - singleRooms.filter(r => isRoomBooked(r, checkIn, checkOut)).length,
        rooms: singleRooms.map(r => ({
          number: r.roomNumber,
          isBooked: isRoomBooked(r, checkIn, checkOut)
        }))
      },
      double: {
        total: doubleRooms.length,
        booked: doubleRooms.filter(r => isRoomBooked(r, checkIn, checkOut)).length,
        vacant: doubleRooms.length - doubleRooms.filter(r => isRoomBooked(r, checkIn, checkOut)).length,
        rooms: doubleRooms.map(r => ({
          number: r.roomNumber,
          isBooked: isRoomBooked(r, checkIn, checkOut)
        }))
      }
    };
  };

  const handleNewBooking = (bookingData) => {
    const { roomNumber, checkIn, checkOut, guestName, guestEmail } = bookingData;
    
    const updatedRooms = rooms.map(room => 
      room.roomNumber === roomNumber
        ? {
            ...room,
            bookings: [
              ...room.bookings,
              { checkIn, checkOut, guestName, guestEmail }
            ]
          }
        : room
    );

    setRooms(updatedRooms);
    return { 
      success: true, 
      message: `Booking successful for Room ${roomNumber}!` 
    };
  };

  return (
    <div className="container">
      <header>
        <h1>Hotel Reservation System</h1>
        <p>Manage bookings and check room availability</p>
         <p>(by Harrison Lin)</p>
      </header>
      
      <main>
        <RoomDashboard 
          availability={calculateAvailability(selectedDate, selectedDate)} 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <BookingForm 
          onBookRoom={handleNewBooking}
          calculateAvailability={calculateAvailability}
        />
      </main>
    </div>
  );
}

export default App;