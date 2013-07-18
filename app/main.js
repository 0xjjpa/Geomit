
var tcpServer;
var commandWindow;
var log;

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
  }
});





function onAcceptCallback(tcpConnection, socketInfo) {
  tcpConnection.addDataReceivedListener(function(data) {
    var json;
    try {
      json = JSON.parse(data || null);
      log.push("[ Cmd Received ] "+data);
    } catch(e) {
      log.push("[ Data Received ] "+data);
    }

    // We have a command, so let's see what are we supposed to do.
    if(json) {
      if(json.create) { // Ah, we need need to create a contributors.json from scratch. No worries
        
      } else if (json.receive) { // Time to receive a json file!

      }

      try {
          tcpConnection.sendMessage("Hello from Chrome Ext", function() {
            console.log("Message was sent", arguments);
          });
      } catch (ex) {
        tcpConnection.sendMessage(ex);
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