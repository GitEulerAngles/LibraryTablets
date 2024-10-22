let reservations = [];

function isSlotReserved(slot) {
    const date = slot.getAttribute('data-date');
    const hour = slot.getAttribute('data-hour').split(':')[0];

    const duration = 1;

    let slotStartHour = parseInt(hour) % 24;
    let slotEndHour = (slotStartHour + duration) % 24;

    slotStartHour = slotStartHour.toString().padStart(2, '0');
    slotEndHour = slotEndHour.toString().padStart(2, '0');

    const startTime = `${slotStartHour}:00`;
    const endTime = `${slotEndHour}:00`;

    const newStartTime = new Date(`${date}T${startTime}:00`);
    const newEndTime = new Date(`${date}T${endTime}:00`);

    if (isNaN(newStartTime) || isNaN(newEndTime)) {
        console.error('Invalid date/time for the slot. Please check the input data.');
        return false;
    }

    const overlappingReservation = reservations.find((reservation, index) => {
        const existingStartTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.startTime)}:00`);
        const existingEndTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.endTime)}:00`);

        if (isNaN(existingStartTime) || isNaN(existingEndTime)) {
            console.error(`Invalid reservation data at index ${index}. Skipping...`);
            return false;
        }

        const overlapDetected = (
            (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
            (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
            (newStartTime < existingStartTime && newEndTime > existingEndTime)
        );

        return overlapDetected ? reservation : false;
    });

    if (overlappingReservation) {
        return overlappingReservation.name;
    }

    return false;
}

function generateCalendarGrid() {
    const today = new Date();
    const calendarSection = document.getElementById("calendar-section");
    const timeColumn = document.querySelector(".time-column");
    const dayHeaders = document.querySelector(".day-headers");
    const dayGrid = document.querySelector(".day-grid");

    dayGrid.innerHTML = '';
    timeColumn.innerHTML = '';
    dayHeaders.innerHTML = '';

    for (let hour = 0; hour < 24; hour++) {
        const timeDiv = document.createElement("div");
        timeDiv.textContent = `${hour}:00`;
        timeColumn.appendChild(timeDiv);
    }

    for (let hour = 0; hour < 24; hour++) {
        for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + dayOffset);

            if (hour === 0) {
                const dayHeader = document.createElement("div");
                dayHeader.textContent = currentDate.toLocaleDateString();
                dayHeaders.appendChild(dayHeader);
            }

            const timeSlot = document.createElement("div");
            const startHour = `${hour + 1}`;
            timeSlot.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
            timeSlot.setAttribute('data-hour', `${startHour}:00`);
            timeSlot.classList.add('time-slot');

            const reservation = isSlotReserved(timeSlot);

            if (reservation) {
                timeSlot.classList.add('reserved');
                timeSlot.textContent = `Reserved - ${reservation}`;
                timeSlot.style.pointerEvents = 'none';
            } else {
                timeSlot.addEventListener('click', () => {
                    document.getElementById('calendar-section').style.display = 'none';
                    reserveTimeSlot(timeSlot);
                });
            }

            dayGrid.appendChild(timeSlot);
        }
    }
}

function reserveTimeSlot(slot) {
    const date = slot.getAttribute('data-date');
    const hour = slot.getAttribute('data-hour');
    let duration = `1`;

    const slotStartHour = hour.padStart(2, '0');
    const endTime = `${(parseInt(slotStartHour) + parseInt(duration)).toString().padStart(2, '0')}:00`;

    const modal = document.getElementById('reservation-modal');
    modal.style.display = 'block';

    const selectedDateTime = document.getElementById('selected-date-time');
    selectedDateTime.textContent = `Date: ${date}, Time: ${hour} - ${endTime} (Duration: ${duration} hour)`;

    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.onclick = () => {
            modal.style.display = 'none';
        };
    }

    const confirmButton = document.getElementById('confirm-reservation');
    confirmButton.onclick = () => {
        const userName = document.getElementById('modal-name').value;
        if (!userName) {
            alert("Please enter your name.");
            return;
        }

        slot.classList.add('reserved');
        slot.textContent = `Reserved - ${userName}`;

        reservations.push({
            date: date,
            startTime: formatTimeTo12Hour(hour),
            endTime: formatTimeTo12Hour(endTime),
            name: userName
        });

        console.log(reservations);

        modal.style.display = 'none';
        generateCalendarGrid();
        document.getElementById('calendar-section').style.display = 'grid';
    };
}

window.onclick = function(event) {
    const modal = document.getElementById('reservation-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function fixDateTimePrediction(dayOffset, hourIndex) {
    const today = new Date();
    const correctedDate = new Date(today);
    correctedDate.setDate(today.getDate() + dayOffset);
  
    correctedDate.setHours(hourIndex);
    correctedDate.setMinutes(0);
    correctedDate.setSeconds(0);
    correctedDate.setMilliseconds(0);
  
    return correctedDate;
}

function updateTimeAndDate() {
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const availabilityDisplay = document.getElementById('available');

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
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

function addListener() {
    document.getElementById('reserve-back-button').addEventListener('click', function() {
        document.getElementById('reservation-form').style.display = 'none';
        document.getElementById('show-form-button').style.display = 'grid';
        document.getElementById('show-calendar-button').style.display = 'grid';
        document.querySelector('.gray-bar-side').style.display = 'grid';
    });

    document.getElementById('show-form-button').addEventListener('click', function() {
        document.getElementById('reservation-form').style.display = 'block';
        document.getElementById('show-form-button').style.display = 'none';
        document.getElementById('show-calendar-button').style.display = 'none';
        document.querySelector('.gray-bar-side').style.display = 'none';
    });

    document.getElementById('show-back-button').addEventListener('click', function() {
        displayReservations();
        document.getElementById('show-form-button').style.display = 'grid';
        document.getElementById('show-calendar-button').style.display = 'grid';
        document.getElementById('available').style.display = 'grid';
        document.getElementById('reservation-modal').style.display = 'none';
        document.getElementById('calendar-section').style.display = 'none';
        document.querySelector('.gray-bar-side').style.display = 'grid';
        document.querySelector('.gray-bar-bottom').style.display = 'grid';
    });

    document.getElementById('show-calendar-button').addEventListener('click', function() {
        generateCalendarGrid();
        document.getElementById('show-form-button').style.display = 'none';
        document.getElementById('show-calendar-button').style.display = 'none';
        document.getElementById('available').style.display = 'none';
        document.getElementById('calendar-section').style.display = 'grid';
        document.querySelector('.gray-bar-side').style.display = 'none';
        document.querySelector('.gray-bar-bottom').style.display = 'none';
    });

    document.getElementById('reserve-room').addEventListener('click', function() {
        let startTime = document.getElementById('start-time').value;
        let endTime = document.getElementById('end-time').value;
        let nuid = document.getElementById('nuid').value;
        let name = document.getElementById('name').value;
        
        if (!name){
            alert("Please enter your name.");
            return;
        }
        if (!startTime){
            alert("Please enter your start time.");
            return;
        }
        if (!endTime){
            alert("Please enter your end time.");
            return;
        }
        
        let today = new Date();
        let date = today.toISOString().split('T')[0];
    
        let formattedStartTime = formatTimeTo12Hour(startTime);
        let formattedEndTime = formatTimeTo12Hour(endTime);
        
        let newStartTime = new Date(`${date}T${startTime}:00`);
        let newEndTime = new Date(`${date}T${endTime}:00`);
    
        if (newStartTime >= newEndTime) {
            alert("The start time cannot be later than or equal to the end time. Please choose a valid time range.");
            return;
        }
    
        let hasOverlap = reservations.some(reservation => {
            let existingStartTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.startTime)}:00`);
            let existingEndTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.endTime)}:00`);
    
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
            date: date,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            nuid: nuid,
            name: name
        });
        
        displayReservations();
    
        document.getElementById('reservation-form').style.display = 'none';
        document.getElementById('show-form-button').style.display = 'grid';
        document.getElementById('show-calendar-button').style.display = 'grid';
        document.querySelector('.gray-bar-side').style.display = 'grid';
    });    
}

function displayReservations() {
    const today = new Date().toISOString().split('T')[0];

    const todayReservations = reservations
        .filter(reservation => reservation.date === today)
        .sort((a, b) => new Date(`${today}T${convertTo24Hour(a.startTime)}:00`) - new Date(`${today}T${convertTo24Hour(b.startTime)}:00`));

    let reservationsList = document.getElementById('gray-bar-input');
    reservationsList.innerHTML = '';

    todayReservations.forEach((reservation, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `Time: ${reservation.startTime} - ${reservation.endTime} (Reserved by: ${reservation.name})`;
        reservationsList.appendChild(listItem);
    });
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const availabilityDisplay = document.getElementById('available');

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const activeReservation = reservations.find(reservation => {
        const existingStartTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.startTime)}:00`);
        const existingEndTime = new Date(`${reservation.date}T${convertTo24Hour(reservation.endTime)}:00`);
        return reservation.date === today && now >= existingStartTime && now < existingEndTime;
    });

    if (activeReservation) {
        const startTime = new Date(`${activeReservation.date}T${convertTo24Hour(activeReservation.startTime)}:00`);
        const endTime = new Date(`${activeReservation.date}T${convertTo24Hour(activeReservation.endTime)}:00`);
        const totalTime = endTime - startTime;
        const elapsedTime = now - startTime;

        const progressPercentage = Math.min((elapsedTime / totalTime) * 100, 100);

        progressBar.style.width = `${progressPercentage}%`;
        availabilityDisplay.textContent = "Unavailable";
        availabilityDisplay.style.color = "red";
    } else {
        progressBar.style.width = 0;
        availabilityDisplay.textContent = "Available";
        availabilityDisplay.style.color = "#258357";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    generateCalendarGrid();
    updateTimeAndDate();
    addListener();
    setInterval(updateTimeAndDate, 1000);
    setInterval(updateProgressBar, 1000);
});