const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");

// Elements for sensor readings

const getElement = (id) => document.getElementById(id);

const tempElementDHT11 = getElement("tempDHT11-d1");
const humElementDHT11 = getElement("humDHT11-d1");
const tempElementDHT22 = getElement("tempDHT22-d1");
const humElementDHT22 = getElement("humDHT22-d1");
const tempElementTypeC = getElement("tempK-TypeC-d1");
const humElementTypeF = getElement("tempK-TypeF-d1");

const tempElementDHT11D2 = getElement("tempDHT11-d2");
const humElementDHT11D2 = getElement("humDHT11-d2");
const tempElementDHT22D2 = getElement("tempDHT22-d2");
const humElementDHT22D2 = getElement("humDHT22-d2");
const tempElementTypeCD2 = getElement("tempK-TypeC-d2");
const humElementTypeFD2 = getElement("tempK-TypeF-d2");

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
    const dbPath = (path) => `UsersData/${uid}/${path}`;
    const dbPathHumDHT11 = dbPath('humidityDHT11');
    const dbPathTempDHT11 = dbPath('temperatureDHT11');
    const dbPathHumDHT22 = dbPath('humidityDHT22');
    const dbPathTempDHT22 = dbPath('temperatureDHT22');
    const dbPathTempKTypeC = dbPath('degreesC');
    const dbPathTempKTypeF = dbPath('degreesF');
    const dbPathHumDHT11D2 = dbPath('humidityDHT11D2');
    const dbPathTempDHT11D2 = dbPath('temperatureDHT11D2');
    const dbPathHumDHT22D2 = dbPath('humidityDHT22D2');
    const dbPathTempDHT22D2 = dbPath('temperatureDHT22D2');
    const dbPathTempKTypeCD2 = dbPath('degreesCD2');
    const dbPathTempKTypeFD2 = dbPath('degreesFD2');



    // Database references

    const dbRef = (path) => firebase.database().ref().child(path);

    const dbRefHumDHT11 = dbRef(dbPathHumDHT11);
    const dbRefTempDHT11 = dbRef(dbPathTempDHT11);
    const dbRefHumDHT22 = dbRef(dbPathHumDHT22);
    const dbRefTempDHT22 = dbRef(dbPathTempDHT22);
    const dbRefTempKTypeC = dbRef(dbPathTempKTypeC);
    const dbRefTempKTypeF = dbRef(dbPathTempKTypeF);

    const dbRefHumDHT11D2 = dbRef(dbPathHumDHT11D2);
    const dbRefTempDHT11D2 = dbRef(dbPathTempDHT11D2);
    const dbRefHumDHT22D2 = dbRef(dbPathHumDHT22D2);
    const dbRefTempDHT22D2 = dbRef(dbPathTempDHT22D2);
    const dbRefTempKTypeCD2 = dbRef(dbPathTempKTypeCD2);
    const dbRefTempKTypeFD2 = dbRef(dbPathTempKTypeFD2);




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