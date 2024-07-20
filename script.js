document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;

    const users = [];
    const flights = [
        { id: 1, departure: 'Delhi', destination: 'Indore', date: '2024-07-25', price: 299.99 },
        { id: 2, departure: 'Mumbai', destination: 'Indore', date: '2024-07-26', price: 199.99 },
        { id: 3, departure: 'Kolkata', destination: 'Indore', date: '2024-07-27', price: 149.99 },
        { id: 4, departure: 'Chennai', destination: 'Indore', date: '2024-07-28', price: 129.99 },
        { id: 5, departure: 'Bengaluru', destination: 'Indore', date: '2024-07-29', price: 179.99 }
    ];

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('reg-name').value;
        const password = document.getElementById('reg-password').value;
        const dob = document.getElementById('reg-dob').value;
        const email = document.getElementById('reg-email').value;

        users.push({ name, password, dob, email });
        document.getElementById('registration-message').textContent = 'Registration successful. Please log in.';
        document.getElementById('registrationForm').reset();
        document.getElementById('goToLogin').style.display = 'block';
    });

    document.getElementById('goToLogin').addEventListener('click', function() {
        document.getElementById('registration-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('reservation-container').style.display = 'block';
        } else {
            document.getElementById('login-message').textContent = 'Invalid email or password.';
        }
    });

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const departure = document.getElementById('departure').value;
        const date = document.getElementById('date').value;

        const filteredFlights = flights.filter(flight =>
            flight.departure.toLowerCase() === departure.toLowerCase() &&
            flight.date === date
        );

        displayFlights(filteredFlights);
    });

    function displayFlights(flights) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        if (flights.length > 0) {
            flights.forEach(flight => {
                const flightCard = document.createElement('div');
                flightCard.className = 'flight-card';
                flightCard.innerHTML = `
                    <h2>Flight from ${flight.departure} to ${flight.destination}</h2>
                    <p>Date: ${flight.date}</p>
                    <p>Price: $${flight.price.toFixed(2)}</p>
                    <button onclick="bookFlight(${flight.id})">Book</button>
                `;
                resultsContainer.appendChild(flightCard);
            });
        } else {
            resultsContainer.innerHTML = '<p>No flights found</p>';
        }
    }

    window.bookFlight = function(flightId) {
        const selectedFlight = flights.find(flight => flight.id === flightId);

        if (selectedFlight) {
            document.getElementById('reservation-container').style.display = 'none';
            document.getElementById('booking-container').style.display = 'block';
            document.getElementById('flightDetails').value = `Flight from ${selectedFlight.departure} to ${selectedFlight.destination} on ${selectedFlight.date} - $${selectedFlight.price.toFixed(2)}`;
        }
    };

    document.getElementById('booking-slots').addEventListener('click', function(event) {
        if (event.target.classList.contains('slot')) {
            document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));
            event.target.classList.add('selected');
            document.getElementById('selectedSlot').value = event.target.getAttribute('data-slot');
        }
    });

    document.getElementById('bookingForm').addEventListener('submit', function(event) {
        event.preventDefault();

        document.getElementById('booking-container').style.display = 'none';
        document.getElementById('payment-container').style.display = 'block';
    });

    document.getElementById('paymentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (paymentMethod) {
            alert('Payment successful! Your ticket has been booked.');
            downloadTicket();
            document.getElementById('payment-container').style.display = 'none';
            document.getElementById('reservation-container').style.display = 'block';
            document.getElementById('loginForm').reset();
            document.getElementById('searchForm').reset();
            document.getElementById('bookingForm').reset();
            document.getElementById('paymentForm').reset();
        } else {
            alert('Please select a payment method.');
        }
    });

    function getDayOfWeek(dateStr) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateStr);
        return daysOfWeek[date.getDay()];
    }

    function downloadTicket() {
        const flightDetails = document.getElementById('flightDetails').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const selectedSlot = document.getElementById('selectedSlot').value;

        const doc = new jsPDF('p', 'mm', 'a4');

        // Title
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("Flight Ticket", 105, 20, null, null, 'center');

        // Flight Details
        doc.setFontSize(16);
        doc.text("Flight Details", 10, 40);
        doc.text(`Flight Details: ${flightDetails}`, 10, 50);
        const flightDate = flightDetails.match(/on (\d{4}-\d{2}-\d{2})/)[1];
        doc.text(`Day of Week: ${getDayOfWeek(flightDate)}`, 10, 60);

        // Passenger Details
        doc.text("Passenger Details", 10, 80);
        doc.text(`Name: ${fullName}`, 10, 90);
        doc.text(`Email: ${email}`, 10, 100);
        doc.text(`Phone: ${phone}`, 10, 110);

        // Slot Details
        doc.text("Slot Details", 10, 130);
        doc.text(`Selected Slot: ${selectedSlot}`, 10, 140);

        // Payment Details
        doc.text("Payment Details", 10, 160);
        doc.text(`Payment Method: ${document.querySelector('input[name="paymentMethod"]:checked').value}`, 10, 170);

        // Inspirational Quote
        const quotes = [
            "Travel is the only thing you buy that makes you richer.",
            "The world is a book, and those who do not travel read only one page.",
            "To travel is to live.",
            "Adventure is worthwhile.",
            "Wander often, wonder always."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        doc.setFontSize(12);
        doc.text(randomQuote, 105, 250, null, null, 'center');

        doc.save("ticket.pdf");
    }

    const upcomingFlights = [
        { id: 1, departure: 'Delhi', destination: 'Indore', date: '2024-07-25', price: 299.99 },
        { id: 2, departure: 'Mumbai', destination: 'Indore', date: '2024-07-26', price: 199.99 },
        { id: 3, departure: 'Kolkata', destination: 'Indore', date: '2024-07-27', price: 149.99 },
        { id: 4, departure: 'Chennai', destination: 'Indore', date: '2024-07-28', price: 129.99 },
        { id: 5, departure: 'Bengaluru', destination: 'Indore', date: '2024-07-29', price: 179.99 }
    ];

    const bookingSlotsContainer = document.getElementById('booking-slots');
    upcomingFlights.forEach(flight => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.setAttribute('data-slot', `Flight ${flight.id}: ${flight.departure} to ${flight.destination} on ${flight.date} - $${flight.price.toFixed(2)}`);
        slot.innerHTML = `
            <h3>Flight from ${flight.departure} to ${flight.destination}</h3>
            <p>Date: ${flight.date}</p>
            <p>Price: $${flight.price.toFixed(2)}</p>
        `;
        bookingSlotsContainer.appendChild(slot);
    });
});



