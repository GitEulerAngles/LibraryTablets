let reservations = [];

function updateTimeAndDate() {
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const availabilityDisplay = document.getElementById('available');

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${formattedMinutes} ${ampm}`;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    timeDisplay.textContent = timeString;
    dateDisplay.textContent = dateString;

    let currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    let isAvailable = true;

    reservations.forEach(reservation => {
        let [startHours, startMinutes] = reservation.startTime.split(':');
        let [endHours, endMinutes] = reservation.endTime.split(':');
        
        let startTimeTotalMinutes = convertTo24HourMinutes(startHours, startMinutes, reservation.startTime.includes('PM'));
        let endTimeTotalMinutes = convertTo24HourMinutes(endHours, endMinutes, reservation.endTime.includes('PM'));

        if (currentTotalMinutes >= startTimeTotalMinutes && currentTotalMinutes <= endTimeTotalMinutes) {
            isAvailable = false;
        }
    });

    if (isAvailable) {
        availabilityDisplay.textContent = "Available";
        availabilityDisplay.style.color = "#258357";
    } else {
        availabilityDisplay.textContent = "Unavailable";
        availabilityDisplay.style.color = "red";
    }
}

function convertTo24HourMinutes(hours, minutes, isPM) {
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (isPM && hours < 12) {
        hours += 12;
    } else if (!isPM && hours === 12) {
        hours = 0;
    }
    return hours * 60 + minutes;
}

function addListener() {
    document.getElementById('show-form-button').addEventListener('click', function() {
        document.getElementById('reservation-form').style.display = 'block';
        document.getElementById('show-form-button').style.display = 'none';
        document.querySelector('.gray-bar-side').style.display = 'none';
    });

    document.getElementById('reserve-room').addEventListener('click', function() {
        let startTime = document.getElementById('start-time').value;
        let endTime = document.getElementById('end-time').value;
        let nuid = document.getElementById('nuid').value;
        let name = document.getElementById('name').value;
    
        let formattedStartTime = formatTimeTo12Hour(startTime);
        let formattedEndTime = formatTimeTo12Hour(endTime);
    
        let newStartTime = new Date(`1970-01-01T${startTime}:00`);
        let newEndTime = new Date(`1970-01-01T${endTime}:00`);
    
        if (newStartTime >= newEndTime) {
            alert("The start time cannot be later than or equal to the end time. Please choose a valid time range.");
            return;
        }
    
        let hasOverlap = reservations.some(reservation => {
            let existingStartTime = new Date(`1970-01-01T${convertTo24Hour(reservation.startTime)}:00`);
            let existingEndTime = new Date(`1970-01-01T${convertTo24Hour(reservation.endTime)}:00`);
    
            return (
                (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
                (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
                (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
            );
        });
    
        if (hasOverlap) {
            alert("This reservation overlaps with an existing one. Please choose a different time.");
            return;
        }
    
        reservations.push({
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            nuid: nuid,
            name: name
        });
    
        console.log(reservations);
    
        displayReservations();
    
        document.getElementById('reservation-form').style.display = 'none';
        document.getElementById('show-form-button').style.display = 'grid';
        document.querySelector('.gray-bar-side').style.display = 'grid';
    });
    
    function formatTimeTo12Hour(time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }
    
    function convertTo24Hour(time) {
        let [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = parseInt(hours);
        
        if (modifier === 'PM' && hours < 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
    
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
}

function displayReservations() {
    let reservationsList = document.getElementById('gray-bar-input');
    reservationsList.innerHTML = '';

    reservations.forEach((reservation, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `Reservation ${index + 1}: ${reservation.name}, from ${reservation.startTime} to ${reservation.endTime}`;
        reservationsList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateTimeAndDate();
    addListener();
    setInterval(updateTimeAndDate, 1000);
});
