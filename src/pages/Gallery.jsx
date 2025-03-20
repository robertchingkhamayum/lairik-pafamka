import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../pages/Style.css";

const Gallery = () => {
    const [seats, setSeats] = useState(Array(50).fill(null));

    useEffect(() => {
        fetchBookedSeats();
    }, []);

    const fetchBookedSeats = async () => {
        const seatsRef = ref(database, "bookings/");
        const snapshot = await get(seatsRef);

        if (snapshot.exists()) {
            const bookedSeats = snapshot.val();
            const updatedSeats = Array(50).fill(null);

            Object.values(bookedSeats).forEach((booking) => {
                const seatIndex = parseInt(booking.seatNumber) - 1;
                if (seatIndex >= 0 && seatIndex < 50) {
                    updatedSeats[seatIndex] = booking;
                }
            });

            setSeats(updatedSeats);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="gallery-container">
                <h3>Seat Arrangement</h3>

                <div className="seat-legend">
                    <span className="legend-item">
                        <div className="seat available"></div> Available (Green)
                    </span>
                    <span className="legend-item">
                        <div className="seat booked"></div> Booked (Red)
                    </span>
                </div>

                <div className="seats-layout">
                    {[...Array(5)].map((_, columnIndex) => (
                        <div key={columnIndex} className="column">
                            <div className="sub-column">
                                {[...Array(5)].map((_, rowIndex) => {
                                    const index = columnIndex * 10 + rowIndex;
                                    return (
                                        <div
                                            key={index}
                                            className={`seat ${seats[index] ? "booked" : "available"}`}
                                        >
                                            {index + 1}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="sub-column">
                                {[...Array(5)].map((_, rowIndex) => {
                                    const index = columnIndex * 10 + rowIndex + 5;
                                    return (
                                        <div
                                            key={index}
                                            className={`seat ${seats[index] ? "booked" : "available"}`}
                                        >
                                            {index + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="login-message">
                    <h2> You need to <strong>log in</strong> to book your slot.</h2>
                </div>

                <div className="image-gallery">
                    <h3>Gallery</h3>
                    <div className="images">
                        <img src="./Images/Image_1.png" alt="Gallery 1" className="gallery-image" />
                        <img src="./Images/Image_2.png" alt="Gallery 2" className="gallery-image" />
                        <img src="./Images/Image_3.png" alt="Gallery 3" className="gallery-image" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Gallery;
