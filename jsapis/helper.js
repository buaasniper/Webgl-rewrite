var ServerConnector = function() {
  this.address = "lab.songli.io";
  this.clientid = "Not Set";

  this.storePicture = function(dataURL, id) {
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
  //update one feature asynchronously to the server
  this.updateFeatures = function(features){
    //
    // include the clientid as one of the feature list
    // extract this information later from the server part
    //
    features['clientid'] = this.clientid;
    console.log(features);
    var xhttp = new XMLHttpRequest();
    var url = ip_address + "/updateFeatures";
    var data = JSON.stringify(features) 
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          console.log(data);
        }
      };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
  }
}
