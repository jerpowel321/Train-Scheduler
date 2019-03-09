// Initialize Firebase
var config = {
    apiKey: "AIzaSyAVqZ7-PMQTUmbxQNR18DiA105jJJ4U8ys",
    authDomain: "train-scheduler-1317b.firebaseapp.com",
    databaseURL: "https://train-scheduler-1317b.firebaseio.com",
    projectId: "train-scheduler-1317b",
    storageBucket: "train-scheduler-1317b.appspot.com",
    messagingSenderId: "201832885897"
  };
  firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var nextArrival = "HH:mm";
var minutesAway = 0;

// Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format("x");
    frequency = $("#frequency-input").val().trim();

    console.log(firstTrainTime);

        // Creates object for holding train data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);

    // alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrainTime-input").val("");
    $("#frequency-input").val("");
});

var count = 1;

// Firebase watcher .on("child_added" and add a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // Prettify the Train start time
    // var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");
    
    var firstTimeConverted = firstTrainTime;
    // console.log(firstTimeConverted);


    var diffTime = moment().diff(moment(firstTimeConverted, "x"));
    var convertedFreqToMiliseconds = frequency*60*1000
    var tRemainder = diffTime % convertedFreqToMiliseconds;
    var minutesAway = Math.floor((frequency - tRemainder/60/1000));
    var nextArrival= moment().add(minutesAway, "minutes").format("hh:mm");
 

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),

    );

    // Append the new row to the table
    $("#train-table").append(newRow);
});
