$(document).ready(function() {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAhK78AjNZ1adTx9irtr8jcYA22fxutyvM",
		authDomain: "train-scheduler-5e50c.firebaseapp.com",
		databaseURL: "https://train-scheduler-5e50c.firebaseio.com",
		projectId: "train-scheduler-5e50c",
		storageBucket: "train-scheduler-5e50c.appspot.com",
		messagingSenderId: "177110193479"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	$("#submit").on("click", function(event){
		event.preventDefault();

		// Grabs user input
	 	var trainName = $("#train-name").val().trim();
	 	var destination = $("#destination").val().trim();
	 	var firstTrain = $("#first-train").val().trim();
	 	var frequency = $("#frequency").val().trim();

	 	// creating the next arrival and minutes away variables with moment js
	 	// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    	// console.log(firstTrainConverted);
    	var currentTime = moment();
    	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    	// Difference between the times
	    var diffTime = currentTime.diff(moment(firstTrainConverted), "minutes");
	    // console.log("DIFFERENCE IN TIME: " + diffTime);
	    // Time apart (remainder)
	    var tRemainder = diffTime % frequency;
	    // console.log(tRemainder);
	    // Minute Until Train
	    var minutesTillTrain = frequency - tRemainder;
	    // console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
	    // Next Train
	    var nextTrain = currentTime.add(minutesTillTrain, "minutes");
	    nextTrain = moment(nextTrain).format("hh:mm");
	    //console.log("ARRIVAL TIME: " + nextTrain);
 	
	 	// uploads the data to firebase
	 	database.ref().push({
	 		trainName: trainName,
	 		destination: destination,
	 		firstTrain: firstTrain,
	 		frequency: frequency,
	 		minutesTillTrain: minutesTillTrain,
	 		nextTrain: nextTrain
	 	});

	 	// Clears all of the text-boxes
	 	$("#train-name").val("");
	 	$("#destination").val("");
	 	$("#first-train").val("");
	 	$("#frequency").val("");

	 });

	database.ref().on("child_added", function (childSnap, prevChildKey){
		var child = childSnap.val();
		var row = $("<tr>");
		var trainName = $("<td>" + child.trainName + "</td>");
		var destination = $("<td>" + child.destination + "</td>");
		var frequency = $("<td>" + child.frequency + "</td>");
		var nextArrival = $("<td>" + child.nextTrain + "</td>");
		var minutesAway = $("<td>" + child.minutesTillTrain + "</td>");

		row.append(trainName);
		row.append(destination);
		row.append(frequency);
		row.append(nextArrival);
		row.append(minutesAway);

		$("#trainsRow").prepend(row);

	 });

});