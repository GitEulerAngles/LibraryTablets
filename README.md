**AUTHORS**:
    Kurt Kuhlman 
    Nathaniel McVay
    Teighan McGahan
    Tyler Roelfs

README.txt Directory:
-Authors 
-Project Overview
-Project/Git Features
-Node.js Structure 
-How to run the program
-Usage

*/ Project Overview /*

<!-- This project aims to improve the functionality of the study room tablets at the University of Nebraska-Lincoln (UNL). These tablets are placed outside study rooms to display availability/reserved. We are enhancing the system with the ability to reserve rooms directly from the tablet, a map of the library, book rooms through the tablet, and in advance through a calendar interface. -->

*/ Features /*
<!-- 
- **Room Availability Display**: Shows whether the study room is available or occupied.
- **Direct Reservation**: Users can reserve the room directly from the tablet.
- **Map Integration**: Displays a map of the library, allowing users to find and reserve other rooms.
- **Calendar Booking**: Allows users to reserve rooms days or weeks in advance. -->

*/ Project Structure with Node.js /*

<!-- 
/node_modules 
# Node.js dependencies app.js 
# Main application logic for the room reservation system index.html
# Main HTML file for the study room tablet UI package-lock.json 
# Dependency lock file (auto-generated) package.json 
# Project metadata and dependencies styles.css 
# Styling for the user interface -->

*/ How to Run Program /*
To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GitEulerAngles/LibraryTablets
   cd study-room-tablet
2. **install node**:
    npm install
3. **start the application**:
    node app.js 
4. **Open within browser**:
    Open index.html in your web browser to view the tablet interface.


Usage

    The home screen will display whether the current study room is available.
    Use the Reserve Room button to book the room directly from the tablet.
    Navigate to the Map to view other available rooms and reserve them.
    Use the Calendar feature to book rooms for future dates.


END 
