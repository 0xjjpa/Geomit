
var tcpServer;
var commandWindow;
var hookWindow;
var log;

var receiveFlag;

var coords;
var username;
var sha;

/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  if (commandWindow && !commandWindow.contentWindow.closed) {
    commandWindow.focus();
  } else {
    chrome.app.window.create('index.html',
      {bounds: {width: 750, height: 180, left: 0}},
      function(w) {
        commandWindow = w;
      });
    chrome.app.window.create('hook.html',
      {bounds: {width: 400, height: 350, left: 770}},
      function(w) {
        hookWindow = w;
      });
  }
});

var parseFeature =  function(coords) {
  return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              coords.longitude,
              coords.latitude
            ]
          },
          "properties": {
            "marker-symbol": "marker",
            "name": username,
            "previous-sha": sha
          }
        }
}

function onAcceptCallback(tcpConnection, socketInfo) {
  tcpConnection.addDataReceivedListener(function(data) {
    var json, geojson, feature;

    if(receiveFlag) { //This data is a json for sure!
      receiveFlag = false;
      try { // ... which doesn't mean we don't have to check!
        geojson = JSON.parse(data || null);
        log.push("Parsing contributors.geojson...");

        coords = getCoords();
        feature = parseFeature(coords);
        
        geojson.features.push(feature);

        log.push("Returning parsed contributors.geojson...");
        tcpConnection.sendMessage(JSON.stringify(geojson), function() {
          log.push("Successfully updated contributors.geojson");
        });
        
      } catch(e) {
        log.push("Failed to parse contributors.geojson! Aborting.");
      }      
    } else {
      try {
        json = JSON.parse(data || null);
      } catch(e) {
        log.push(data); // Anything no-json goes to the console
      }

      // We have a command, so let's see what are we supposed to do.
      if(json) {
        username = json.username;
        sha = json.sha;
        if(json.create) { // Ah, we need need to create a contributors.json from scratch. No worries
          log.push("No contributors.geojson. Creating one...");

          geojson = {"type":"FeatureCollection","features":[]}
          log.push("Creating contributors.geojson...");

          coords = getCoords();
          feature = parseFeature(coords);
          
          geojson.features.push(feature);

          log.push("Returning new contributors.geojson...");
          tcpConnection.sendMessage(JSON.stringify(geojson), function() {
            log.push("Successfully created contributors.geojson");
          });

        } else if (json.receive) { // Time to receive a json file!
          log.push("Contributors.geojson found!");
          receiveFlag = true;
        }
      }
    }
  
  });
};

function startServer(addr, port) {
  if (tcpServer) {
    tcpServer.disconnect();
  }
  tcpServer = new TcpServer(addr, port);
  tcpServer.listen(onAcceptCallback);
}


function stopServer() {
  if (tcpServer) {
    tcpServer.disconnect();
    tcpServer = null;
  }
}

function getServerState() {
  if (tcpServer) {
    return {
      isConnected: tcpServer.isConnected(),
      addr: tcpServer.addr,
      port: tcpServer.port
    };
  } else {
    return {isConnected: false};
  }
}