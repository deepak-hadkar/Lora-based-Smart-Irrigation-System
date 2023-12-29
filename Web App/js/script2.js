// Get the button and timestamp elements
var waterNowBtn = window.document.getElementById("ww");
var lastWateredTimestamp = window.document.getElementById("lastWateredTimestamp");
var currentTime = window.document.getElementById("currentTime");

// DOM init event listner
 document.addEventListener("DOMContentLoaded", function() {
  const dt = localStorage.getItem('lastWatered') || '';
  document.getElementById("lastWateredTimestamp").textContent= dt;
}); 



// Add a click event listener to the button
waterNowBtn.addEventListener("click", function() {
    console.log('here');
  // Show watering animation
  window.document.getElementById('ww').setAttribute("style","display:none;");
  window.document.getElementById('aa').setAttribute("style","display:block;");

  //set firebase to watering //status : 1

  firebase.auth().onAuthStateChanged(function (user) {
    console.log('user   ' , user);
    var uid = user.uid;
    var dbRef = firebase.database().ref("user/" + uid + "/sensor");
    var val;
    dbRef.on('value', function(snapshot) {
      var data = snapshot.val();
      data.status = 1;
      val = {...data};
      console.log(data);
    }, function(error) {
      console.error(error);
    });

    dbRef.update(val)
  .then(function() {
    console.log("Data updated successfully!");
  })
  .catch(function(error) {
    console.error("Error updating data:", error);
  });
  });

  setTimeout(function() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    firebase.auth().onAuthStateChanged(function (user) {
      console.log('user   ' , user);
      var uid = user.uid;
      var dbRef = firebase.database().ref("user/" + uid + "/sensor");
      var val;
      dbRef.on('value', function(snapshot) {
        var data = snapshot.val();
        data.status = 0;
        val = {...data};
        console.log(data);
      }, function(error) {
        console.error(error);
      });
  
    dbRef.update(val)
    .then(function() {
      console.log("Data updated successfully!");
    })
    .catch(function(error) {
      console.error("Error updating data:", error);
    });
    });

    document.getElementById("CurrentOnTime").textContent= dateTime;
    //save in localStorage
    localStorage.setItem('lastWatered' , dateTime);
    window.document.getElementById('aa').setAttribute("style","display:none;");
    window.document.getElementById('ww').setAttribute("style","display:block;");
}, 10000);
});
