// "use client";
// import { useUser } from "context/UserContext";

// const EmployeePage = () => {
//   const { user } = useUser();
//   const bookings = await fetch("http://localhost:3000/bookings/hotel/" + user.hotel_id).then((res) => res.json());

//   return (

//   );
// };

// export default EmployeePage;
"use client";
import { useState, useEffect } from "react";
import { useUser } from "context/UserContext";
import RentRoomModal from "./component/rentRoomModal";

const EmployeePage = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updateData, setUpdateData] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{
    room_id: number;
    price: number;
  } | null>(null);

  interface Booking {
    booking_id: number;
    employee_id: number | null;
    room_id: number;
    customer_id: number;
    check_in_date: string; // ISO string format
    check_out_date: string; // ISO string format
    booking_date: string; // ISO string format
    is_renting: boolean;
    is_checkout: boolean;
    is_archived: boolean;
    total_cost: string; // Consider changing to number if calculations are needed
    is_paid: boolean;
    customer_name: string;
    employee_name: string | null;
  }

  interface Room {
    room_id: number;
    price: number;
    capacity: number;
    view: string;
    amenities: string;
  }

  const handlePayment = async (bookingId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/${bookingId}/pay`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) throw new Error("Payment failed");

      setUpdateData(0 + Math.random());
    } catch (error) {
      console.error("Error paying:", error);
      alert("Failed to pay");
    }
  };

  const handleCheckIn = async (bookingId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/${bookingId}/rent`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: user.employee_id }),
        }
      );

      if (!response.ok) throw new Error("Check-in failed");

      setUpdateData(0 + Math.random());
    } catch (error) {
      console.error("Error checking in:", error);
      alert("Failed to check-in");
    }
  };

  const handleCheckOut = async (bookingId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/${bookingId}/checkout`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) throw new Error("Check-out failed");

      setUpdateData(0 + Math.random());
    } catch (error) {
      console.error("Error checking out:", error);
      alert("Failed to check-out");
    }
  };

  const handleArchive = async (bookingId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Archive failed");

      setUpdateData(0 + Math.random());
    } catch (error) {
      console.error("Error archiving:", error);
      alert("Failed to archive");
    }
  };

  const handleRentInPerson = async (
    roomId: number,
    customerId: number,
    totalCost: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await fetch("http://localhost:3000/bookings/in-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_in_date: startDate,
          check_out_date: endDate,
          room_id: roomId,
          customer_id: customerId,
          total_cost: totalCost,
          employee_id: user.employee_id,
        }),
      });

      if (!response.ok) throw new Error("Rent failed");

      setUpdateData(0 + Math.random());
    } catch (error) {
      console.error("Error renting room:", error);
      alert("Failed to rent room");
    }
  };

  useEffect(() => {
    if (!user?.hotel_id) return;

    const fetchBookingsAndRooms = async () => {
      try {
        const [bookingsRes, roomsRes] = await Promise.all([
          fetch(`http://localhost:3000/bookings/hotel/${user.hotel_id}`).then(
            (res) => res.json()
          ),
          fetch(`http://localhost:3000/rooms/hotel/${user.hotel_id}`).then(
            (res) => res.json()
          ),
        ]);

        setBookings(bookingsRes);
        setRooms(roomsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsAndRooms();
  }, [user, updateData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>

      {/* Bookings Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Bookings</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Room ID</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>pay status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking: Booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.customer_name}</td>
                    <td>{booking.room_id}</td>
                    <td>
                      {new Date(booking.check_in_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </td>
                    <td>
                      {new Date(booking.check_out_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </td>
                    <td>
                      {!booking.is_paid ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePayment(booking.booking_id)}
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="text-green-500">Paid</span>
                      )}
                    </td>
                    <td>
                      {!booking.is_renting && !booking.is_checkout && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleCheckIn(booking.booking_id)}
                        >
                          Check-in
                        </button>
                      )}
                      {booking.is_renting && !booking.is_checkout && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleCheckOut(booking.booking_id)}
                        >
                          Check-out
                        </button>
                      )}
                      {booking.is_checkout && !booking.is_archived && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleArchive(booking.booking_id)}
                        >
                          Archive
                        </button>
                      )}
                      {booking.is_archived && (
                        <span className="text-gray-500">Archived</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rooms Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.length > 0 ? (
            rooms.map((room: Room) => (
              <div
                key={room.room_id}
                className="card bg-base-100 shadow-lg p-4"
              >
                <h3 className="text-lg font-semibold">Room {room.room_id}</h3>
                <p>
                  Price: <span className="font-bold">${room.price}/night</span>
                </p>
                <p>Capacity: {room.capacity}</p>
                <p>View: {room.view}</p>
                <p>Amenities: {room.amenities}</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setSelectedRoom({
                      room_id: room.room_id,
                      price: room.price,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Rent
                </button>
              </div>
            ))
          ) : (
            <p>No rooms found.</p>
          )}

          {/* Rent Room Modal */}
          {selectedRoom && (
            <RentRoomModal
              roomId={selectedRoom.room_id}
              price={selectedRoom.price}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onRent={handleRentInPerson}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
