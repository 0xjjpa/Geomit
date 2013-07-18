angular.module("Geomit", [])
.controller('MainController', ['$scope','$timeout', function($scope, $timeout) {
  var YELLOW = "rgb(229, 202, 96)";
  var GREEN = "rgb(144, 229, 96)";
  var RED = "rgb(229, 96, 96)";

  $scope.status = {
    message: "Offline",
    code: RED
  }

  $scope.logs = [] 

  var setStatus = function(message, code) {
    $scope.$apply(function() {
      $scope.status = {
        message: message,
        code: code
      }  
    });
  }

  var logMachine = {
    push: function(msg) {
      $scope.$apply(function() {
        $scope.logs.unshift(msg);  
      })
    }
  }


  chrome.runtime.getBackgroundPage(function(backgroundPage) {
    var currentState;
    backgroundPage.log = logMachine;

    currentState = backgroundPage.getServerState();
    if (currentState.isConnected) {
      setStatus("Listening to address " + currentState.addr + " on port " + currentState.port, GREEN);
    } else {

      $timeout(function() {
        setStatus("Creating TCP server...", YELLOW);
      }, 500); //Timeout is for UX

      $timeout(function() {
        backgroundPage.startServer("127.0.0.1", 8888);
        currentState = backgroundPage.getServerState();

        if (currentState.addr) {
          setStatus("Listening to address " + currentState.addr + " on port " + currentState.port, GREEN);
        } else {
          setStatus("Failed creating TCP server", RED);
        }

      }, 1000)

    }
    
  });

}])