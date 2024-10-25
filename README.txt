Project made by Kurt Kuhlman

Startup instruction:
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
