Project made by Kurt Kuhlman

Project overview:
This project aims to improve the graphical user interface outside of the study rooms at the library for the University of Nebraska-Lincoln. 
It dynamically updates its date and time according to the user's computer and will correctly display that the simulated room is reserved if the time the user enters in the reservation screen is between their current time.
The home screen allows the user to see the reservations for today and gives a visual if the simulated room is currently reserved.
The calendar screen allows the user to book the current simulated room days in advance and displays which rooms are already booked.

Startup instruction:
 - The project's dependencies and code should already be pre-compiled. Inside of the project's directory, click on the "index.html" file and the webpage should run.
 - If the webpage does not run, please follow the alternative startup instructions down below.

Alternative startup instruction:
 - Installing Node.js and npm...
    If node isn't installed already, download and install node.js from https://nodejs.org/.
    Verify that node.js has successfully installed by running the following commands in a terminal or command prompt:
        node -v
        npm -v 
 - Navigating to the system direction...
    Open a terminal or command prompt.
    Use the cd command from the terminal or command prompt to navigate to the folder the project is located. For example:
        cd Users\Name\Tablet-Design
 - Installing and running the project...
    Once you are inside of the project folder, run the command to install all npm dependencies:
        npm install
    When all of the dependencies are downloaded, the project can be run via the command:
        npm start
 - Confirm that the project has started...
    The terminal should new display a message indicating that the server is running. The message might be phrased as follows:
        Serving "path\to\project\Tablet-Design" at http://localhost:3000
    The project should be running on an internet browser. Enjoy.

Three tasks being tested:
 - The ability to reserve a room.
    Goal: ensure that the user can successfully reserve a room via inputs and correct visual feedback.
    Depth task: This is the depth task, as a room can be reserved either by pressing the reserve button or by using the calendar feature, thus allowing for full testing of functionality.

 - Viewing and verifying reservations.
    Goal: ensure that the user can visually find their reservation.

 - Navigating and using the calendar function.
    Goal: test the functionality of the calendar feature by scrolling through and making a reservation for days in advance.
