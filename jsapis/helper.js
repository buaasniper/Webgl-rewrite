// 
// This class is used to send pictures back to server
// param 1: the unique client id
// param 2: the number of pictures
// this class will send all pictures one by one
// and send the hashes with the other information 
// together in one POST request
//
// API:
//  this.updatePicture(pic_id, dataURL) 
//
var ServerConnector = function(clientid, num_test) {
  this.address = "http://lab.songli.io/sjcollect";
  this.clientid = clientid;
  this.num_test = num_test;
  this.finished_test = 0;
  this.pictures = {};

  this.storePicture = function(dataURL) {
    var xhttp = new XMLHttpRequest();
    var url = this.address + "/pictures";
    var data = "imageBase64=" + encodeURIComponent(dataURL); 
    var _this = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var hashValue = this.responseText;
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
  }

  // input the update data in dict format 
  // send the dict to address
  this.sendToServer = function(){
    //
    // include the clientid as one of the feature list
    // extract this information later from the server part
    //
    this.clientid = clientid;
    var readyToSend = {};
    readyToSend['clientid'] = this.clientid;
    readyToSend['pichashes'] = "";
    for (var key in this.pictures) {
      readyToSend['pichashes'] += key + '_' + this.pictures[key] + ',';
    }
    var xhttp = new XMLHttpRequest();
    var url = this.address + "/receive";
    var data = JSON.stringify(readyToSend);
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(data);
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
  }

  // send everything back to server here
  // we send the pictures to server
  

  // update the picture
  this.updatePicture = function(pic_id, dataURL) {
    this.storePicture(dataURL);
    this.pictures[pic_id] = dataURL;
    this.finished_test ++;
    if (this.finished_test >= this.num_test) {
      this.sendToServer();
    }
  }
}



