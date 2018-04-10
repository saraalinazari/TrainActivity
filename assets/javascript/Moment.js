var config = {
    apiKey: "AIzaSyD07SAJgpBNmDiC9ec1wcl6FQAzo-LFVfg",
    authDomain: "trainactivity-6372c.firebaseapp.com",
    databaseURL: "https://trainactivity-6372c.firebaseio.com",
    projectId: "trainactivity-6372c",
    storageBucket: "",
    messagingSenderId: "546665762525"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
//   function showAll(){

//   }

function checkTime()
{
    //console.log($("#firstTrainInput"));//document.forms[0].elements[2].value);
  var errorMsg = "";
 var field=document.forms[0].elements[2].value;
  // regular expression to match required time format
  re = /^(\d{1,2}):(\d{1,2})$/;
  regs = field.match(re);
  //console.log(regs[1]);
  if(field != '') {
    if(regs) {
    //   if(regs[4]) {
    //     // 12-hour time format with am/pm
    //     if(regs[1] < 1 || regs[1] > 12) {
    //       errorMsg = "Invalid value for hours: " + regs[1];
    //     }
    //   } else {
        // 24-hour time format
        console.log("regs[1]"+regs[1]);
        console.log("regs[2]"+regs[2]);
        if(regs[1] > 23) {
          errorMsg = "Invalid value for hours: " + regs[1];
        }
        if(!errorMsg && regs[2] > 59) {
            errorMsg = "Invalid value for minutes: " + regs[2];
          }
      }
    //   if(!errorMsg && regs[2] > 59) {
    //     errorMsg = "Invalid value for minutes: " + regs[2];
    //   }
    } if(regs==null) {
      errorMsg = "Invalid time format: " + field;
    }
  

  if(errorMsg != "") {
    alert(errorMsg);
    document.forms[0].elements[2].focus();
    return false;
  }

  return true;
}
function checkNumber()
{
    console.log(document.forms[0].elements[3].value);
  var errorMsg = "";
 var field=document.forms[0].elements[3].value;
  // regular expression to match required time format
  re = /^\d+/;
  regs = field.match(re);
  console.log(re);
  console.log(regs);
  if(field != '') {
    if(field.match(re) ) {
        return true;
        //errorMsg = "Invalid value for format2: " ;
    }
    else{errorMsg = "Invalid value for format2: " ;}
}

  if(errorMsg != "") {
    alert(errorMsg);
    document.forms[0].elements[3].focus();
    return false;
  }


}


  $("#addTrain").on("click", function(e){
    e.preventDefault();
    var validate1= checkTime();
    var validate2= checkNumber();
 
 if((validate1) && (validate2) ){
    var trainName=$("#trainNameInput").val().trim();
    var destination=$("#destinationInput").val().trim();
    var firstTrain=$("#firstTrainInput").val().trim();
    var frequency=$("#frequencyInput").val().trim();
    
    console.log("trainName: "+trainName);
    console.log("destination: "+destination);
    console.log("firstTrain: "+firstTrain);
    console.log("frequency: "+frequency);
    
  if(firstTrain.length<5){
      var index=firstTrain.indexOf(":");
      console.log("index"+index);
      var h="";
      var m = "";
      console.log("index"+index);
      h = firstTrain.substr(0,index);
      m = firstTrain.substr(index+1);
      console.log("h0"+h);
      console.log("m0"+m);
      if(h.length < 2){
      
         h="0"+h;
      }
      if(m.length<2){
     
         m="0"+m;
      }
     
      console.log("h"+h);
      console.log("m"+m);
      firstTrain=h+":"+m;
  }
      
    
      database.ref().push({
          trainName: trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    }
  });


  database.ref().on("child_added",function(snapshot){
      var sv=snapshot.val();
      console.log(sv.destination);
      console.log(sv.trainName);
      console.log(sv.frequency);
      console.log(sv.firstTrain);
      
      var arrive = nextArrival(sv.firstTrain,sv.frequency);
    $("#trainSchedule").append("<tr><td>"+sv.trainName+"</td>"+
                                    "<td>"+sv.destination+"</td>"+
                                    "<td>"+sv.frequency+"</td>"+
                                    "<td>"+arrive.substr(0,5)+"</td>"+
                                    "<td>"+arrive.substr(6)+"</td>"+
    "</tr>");
  });

//   database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added",function(){

//   });
 function nextArrival(firstTrain, frequency){
    var current =new Date();
    var curHour=current.getHours();
    var curMintue=current.getMinutes();
    var curSecond=current.getSeconds();
    var curMins = (curHour*60)+curMintue;

    var firstTrainHour= parseInt(firstTrain.substr(0,2));
    var firstTrainMin = parseInt(firstTrain.substr(3,2));
    var firstTrainMins = (firstTrainHour*60) +firstTrainMin;
    var difMin=0;
    var temp=0;
    var freq = parseInt(frequency);
    var arriveMins = 0;
    if(firstTrainMins <= curMins){
        difMin = curMins - firstTrainMins;
        temp = difMin % freq;
        arriveMins = freq - temp;

    }
    if(firstTrainMins > curMins){
        arriveMins = firstTrainMins - curMins;
    }

     var arriveTotalMins = arriveMins+curMins;
     var arriveHour =Math.floor(arriveTotalMins/60);
     var arriveMin = arriveTotalMins%60;

     var arrive = arriveHour.toString()+ ":"+ arriveMin.toString() + "*"+ arriveMins;
   //  return arrive;
      console.log("arriveHour"+arriveHour );
      console.log("arriveMin"+arriveMin );
    return arrive;
 }