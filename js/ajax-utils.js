(function (global) {


//Set up a namespace for our utility
var ajaxUtils = {};
// Return an HTTP request object
function getRequestObject() {
    // body...
    if(global.XMLHttpRequest){
        return (new XMLHttpRequest());
    }
    else {
        global.alert("Ajax is not supported")
        return (null);ss
    }
};

// Makes an ajax GET request to 'requestURL'
ajaxUtils.sendGetRequest =
  function(requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.open("GET", requestUrl, true);

    request.onreadystatechange =
      function() {
        handelResponse(request, responseHandler,isJsonResponse);
      };

    request.send(); // for POST only

  };

// ONly calls user provided 'responseHandler'
// function if response is ready
//and not an error
function handelResponse(request, responseHandler,isJsonResponse){
    if((request.readyState == 4 ) && (request.status == 200)){
        // default is isJsonResponse = true
        if(isJsonResponse== undefined){
            isJsonResponse = true;
        }
        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
        }
        else {
            responseHandler(request.responseText);
        }

    }
};
// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;

})(window);
