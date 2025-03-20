import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { ref, get, set, remove } from "firebase/database";
import LogoutNavbar from "../Booking/LogoutNavbar"; 
import Footer from "../components/Footer";
import "./BookingPage.css"

const BookingPage = () => {
    const navigate = useNavigate();
    const [seats, setSeats] = useState(Array(50).fill(null));
    const [user, setUser] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [duration, setDuration] = useState("");
    const [shift, setShift] = useState("Morning");
    const [userBookings, setUserBookings] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [oldSeatNumber, setOldSeatNumber] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (loggedInUser) => {
            if (!loggedInUser) {
                navigate("/login");
            } else {
                setUser(loggedInUser);
                await fetchUserDetails(loggedInUser.uid);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            fetchBookedSeats();
        }
    }, [user]);

    const fetchUserDetails = async (userId) => {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            setFullName(userData.fullName || "");
            setEmail(userData.email || "");
            setPhone(userData.phone || "");
        }
    };

    const fetchBookedSeats = async () => {
        const seatsRef = ref(database, "bookings/");
        const snapshot = await get(seatsRef);
        if (snapshot.exists()) {
            const bookedSeats = snapshot.val();
            const updatedSeats = Array(50).fill(null);
    
            Object.values(bookedSeats).forEach((booking) => {
                updatedSeats[booking.seatNumber - 1] = booking;
            });
    
            setSeats(updatedSeats);
    
            if (user) {
                const userSeats = Object.values(bookedSeats).filter((b) => b.userId === user.uid);
                setUserBookings(userSeats);
            }
        } else {
            setSeats(Array(50).fill(null)); 
        }
    };
    
    const handleSeatSelection = (seatIndex) => {
        if (seats[seatIndex] && (!isEditing || seatIndex + 1 !== oldSeatNumber)) {
            alert(`Seat ${seatIndex + 1} is already booked.`);
            return;
        }
        setSelectedSeat(seatIndex + 1);
    };
    
    const confirmBooking = async () => {
        if (selectedSeat === null) {
            alert("Please select a seat before booking!");
            return;
        }

        if (!fullName || !email || !phone || !duration || parseInt(duration) <= 0) {
            alert("Please fill in all details and select a valid duration.");
            return;
        }

        const userId = user.uid;
        const bookingRef = ref(database, `bookings/${userId}_${selectedSeat}`);

        await set(bookingRef, {
            userId,
            seatNumber: selectedSeat,
            fullName,
            email,
            phone,
            duration: parseInt(duration),
            shift,
        });

        alert(`Seat ${selectedSeat} booked successfully!`);
        setSelectedSeat(null);
        fetchBookedSeats();
    };

    const cancelBooking = async (seatNumber) => {
        const confirmCancel = window.confirm(`Are you sure you want to cancel the booking for Seat ${seatNumber}`)
        
        if(!confirmCancel){
            return;
        }

        const bookingRef = ref(database, `bookings/${user.uid}_${seatNumber}`);
        await remove(bookingRef);

        alert(`Your booking for Seat ${seatNumber} has been canceled.`);
        fetchBookedSeats();
    };

    const editBooking = (booking) => {
        setIsEditing(true);
        setOldSeatNumber(booking.seatNumber);
        setSelectedSeat(booking.seatNumber);
        setFullName(booking.fullName);
        setEmail(booking.email);
        setPhone(booking.phone);
        setDuration(booking.duration);
        setShift(booking.shift);
    }

    const cancelEdit = () => {
        setIsEditing(false);
        setSelectedSeat(null);
        setOldSeatNumber(null);
        setFullName("");
        setEmail("");
        setPhone("");
        setDuration("");
        setShift("");
    }

    const updateBooking = async () => {
        if (selectedSeat === null) {
            alert("Please select a seat before updating!");
            return;
        }
        if (!fullName || !email || !phone || !duration || parseInt(duration) <= 0) {
            alert("Please fill out all the details and select a valid duration.");
            return;
        }
    
        const userId = user.uid;
    
        if (oldSeatNumber !== selectedSeat) {
            const oldBookingRef = ref(database, `bookings/${userId}_${oldSeatNumber}`);
            await remove(oldBookingRef);
        }
    
        const newBookingRef = ref(database, `bookings/${userId}_${selectedSeat}`);
        await set(newBookingRef, {
            userId,
            seatNumber: selectedSeat,
            fullName,
            email,
            phone,
            duration: parseInt(duration),
            shift,
        });
    
        alert(`Booking updated successfully!`);
        
        setIsEditing(false);
        setSelectedSeat(null);
        setOldSeatNumber(null);
    
        fetchBookedSeats();
    };
    
    return (
        <div>
            <LogoutNavbar />
            <div className="booking-container">
                <h3>Hi {fullName ? fullName : "" }! Book your slot </h3>

                <div className="seats-layout">
                    {[...Array(5)].map((_, columnIndex) => (
                        <div key={columnIndex} className="column">
                            <div className="sub-column">
                                {[...Array(5)].map((_, rowIndex) => {
                                    const index = columnIndex * 10 + rowIndex;
                                    return (
                                        <button
                                            key={index}
                                            disabled={seats[index] !== null}
                                            className={`seat ${seats[index] ? "booked" : selectedSeat === index + 1 ? "selected" : "available"}`}
                                            onClick={() => handleSeatSelection(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="sub-column">
                                {[...Array(5)].map((_, rowIndex) => {
                                    const index = columnIndex * 10 + rowIndex + 5;
                                    return (
                                        <button
                                            key={index}
                                            disabled={seats[index] !== null}
                                            className={`seat ${seats[index] ? "booked" : selectedSeat === index + 1 ? "selected" : "available"}`}
                                            onClick={() => handleSeatSelection(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedSeat !== null && (
                    <div className="booking-details">
                        <label>Full Name:</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />

                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label>Phone Number:</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

                        <label>Choose Duration (Days):</label>
                        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value.replace(/\D/, ""))} placeholder="Enter days" />

                        <label>Choose Shift:</label>
                        <select value={shift} onChange={(e) => setShift(e.target.value)}>
                            <option value="Morning">Morning</option>
                            <option value="Evening">Evening</option>
                        </select>
                        {isEditing ? (
                            <div className="update-container">
                                <button className="confirm-btn" onClick={updateBooking}>Update Booking</button>
                                <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel Edit</button>
                            </div>
                        ) : (
                            <button className="confirm-btn" onClick={confirmBooking}>Confirm Booking</button>
                        )}
                    </div>
                )}

                {userBookings.length > 0 && (
                    <div className="user-bookings">
                        <h4>Your Booked Seats</h4>
                        {userBookings.map((booking) => (
                            <div key={booking.seatNumber} className="booking-item">
                                <span>
                                    Seat {booking.seatNumber} - {booking.duration} days ({booking.shift} shift)
                                </span>
                                <button className="edit-btn" onClick={() => editBooking(booking)}>
                                    Edit
                                </button>
                                <button className="cancel-btn" onClick={() => cancelBooking(booking.seatNumber)}>
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BookingPage;
