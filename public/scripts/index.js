const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");

// Elements for sensor readings

const tempElementDHT11 = document.getElementById("tempDHT11-d1");
const humElementDHT11 = document.getElementById("humDHT11-d1");
const tempElementDHT22 = document.getElementById("tempDHT22-d1");
const humElementDHT22 = document.getElementById("humDHT22-d1");
const tempElementTypeC = document.getElementById("tempK-TypeC-d1");
const humElementTypeF = document.getElementById("tempK-TypeF-d1");

const tempElementDHT11D2 = document.getElementById("tempDHT11-d2");
const humElementDHT11D2 = document.getElementById("humDHT11-d2");
const tempElementDHT22D2 = document.getElementById("tempDHT22-d2");
const humElementDHT22D2 = document.getElementById("humDHT22-d2");
const tempElementTypeCD2 = document.getElementById("tempK-TypeC-d2");
const humElementTypeFD2 = document.getElementById("tempK-TypeF-d2");

// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database paths (with user UID)
    var dbPathHumDHT11 = 'UsersData/' + uid.toString() + '/humidityDHT11';
    var dbPathTempDHT11 = 'UsersData/' + uid.toString() + '/temperatureDHT11';
    var dbPathHumDHT22 = 'UsersData/' + uid.toString() + '/humidityDHT22';
    var dbPathTempDHT22 = 'UsersData/' + uid.toString() + '/temperatureDHT22';
    var dbPathTempKTypeC = 'UsersData/' + uid.toString() + '/degreesC';
    var dbPathTempKTypeF = 'UsersData/' + uid.toString() + '/degreesF';

    var dbPathHumDHT11D2 = 'UsersData/' + uid.toString() + '/humidityDHT11D2';
    var dbPathTempDHT11D2 = 'UsersData/' + uid.toString() + '/temperatureDHT11D2';
    var dbPathHumDHT22D2 = 'UsersData/' + uid.toString() + '/humidityDHT22D2';
    var dbPathTempDHT22D2 = 'UsersData/' + uid.toString() + '/temperatureDHT22D2';
    var dbPathTempKTypeCD2 = 'UsersData/' + uid.toString() + '/degreesCD2';
    var dbPathTempKTypeFD2 = 'UsersData/' + uid.toString() + '/degreesFD2';



    // Database references

    var dbRefHumDHT11 = firebase.database().ref().child(dbPathHumDHT11);
    var dbRefTempDHT11 = firebase.database().ref().child(dbPathTempDHT11);
    var dbRefHumDHT22 = firebase.database().ref().child(dbPathHumDHT22);
    var dbRefTempDHT22 = firebase.database().ref().child(dbPathTempDHT22);
    var dbRefTempKTypeC = firebase.database().ref().child(dbPathTempKTypeC);
    var dbRefTempKTypeF = firebase.database().ref().child(dbPathTempKTypeF);

    var dbRefHumDHT11D2 = firebase.database().ref().child(dbPathHumDHT11D2);
    var dbRefTempDHT11D2 = firebase.database().ref().child(dbPathTempDHT11D2);
    var dbRefHumDHT22D2 = firebase.database().ref().child(dbPathHumDHT22D2);
    var dbRefTempDHT22D2 = firebase.database().ref().child(dbPathTempDHT22D2);
    var dbRefTempKTypeCD2 = firebase.database().ref().child(dbPathTempKTypeCD2);
    var dbRefTempKTypeFD2 = firebase.database().ref().child(dbPathTempKTypeFD2);




    // Update page with new readings
    dbRefTempDHT11.on('value', snap => {
      tempElementDHT11.innerText = snap.val().toFixed(2);
      var x = (new Date()).getTime(),
      y= parseFloat(snap.val().toFixed(2));

      if(chartT.series[0].data.length > 40) {
        chartT.series[0].addPoint([x, y], true, true, true);
      } else {
        chartT.series[0].addPoint([x, y], true, false, true);
      }
    });

    dbRefTempDHT22.on('value', snap => {
      tempElementDHT22.innerText = snap.val().toFixed(2);
    });

    dbRefHumDHT11.on('value', snap => {
      humElementDHT11.innerText = snap.val().toFixed(2);
      var x = (new Date()).getTime(),
      y= parseFloat(snap.val().toFixed(2));

      if(chartH.series[0].data.length > 40) {
        chartH.series[0].addPoint([x, y], true, true, true);
      } else {
        chartH.series[0].addPoint([x, y], true, false, true);
      }
    });

    dbRefHumDHT22.on('value', snap => {
      humElementDHT22.innerText = snap.val().toFixed(2);
    });

    dbRefTempKTypeC.on('value', snap => {
      tempElementTypeC.innerText = snap.val().toFixed(2);
    });

    dbRefTempKTypeF.on('value', snap => {
      humElementTypeF.innerText = snap.val().toFixed(2);
    });

    dbRefTempDHT11D2.on('value', snap => {
      tempElementDHT11D2.innerText = snap.val().toFixed(2);
      var x = (new Date()).getTime(),
      y= parseFloat(snap.val().toFixed(2));

      if(chartTd2.series[0].data.length > 40) {
        chartTd2.series[0].addPoint([x, y], true, true, true);
      }else {
        chartTd2.series[0].addPoint([x, y], true, false, true);
      }
    });

    dbRefTempDHT22D2.on('value', snap => {
      tempElementDHT22D2.innerText = snap.val().toFixed(2);
    });

    dbRefHumDHT11D2.on('value', snap => {
      humElementDHT11D2.innerText = snap.val().toFixed(2);
    });

    dbRefHumDHT22D2.on('value', snap => {
      humElementDHT22D2.innerText = snap.val().toFixed(2);
    });

    dbRefTempKTypeCD2.on('value', snap => {
      tempElementTypeCD2.innerText = snap.val().toFixed(2);
    });

    dbRefTempKTypeFD2.on('value', snap => {
      humElementTypeFD2.innerText = snap.val().toFixed(2);
    });


  // if user is logged out
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
  }
}
/*function toggleLed() {
  console.log("Toggle");
  if (ledElement.checked) 
  {
    console.log("led ON");
    firebase.database().ref(dbPathLed).set("ON");
  }
  else{
    console.log("led OFF");
    firebase.database().ref(dbPathLed).set("OFF");
  }
}*/

/*setInterval(function ( ) {
 
      var x = (new Date()).getTime(),
      y=5;
         // y = parseFloat(this.responseText);
      //console.log(this.responseText);
      if(chartT.series[0].data.length > 40) {
        chartT.series[0].addPoint([x, y], true, true, true);
      } else {
        chartT.series[0].addPoint([x, y], true, false, true);
      }
    
 
 
}, 1000 ) ;*/