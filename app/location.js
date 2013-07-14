function success(position) {
  console.log("Position", position);
}

function error(msg) {
  console.log("Error, sad puppy", msg);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}