const locationDiv = document.querySelector('#location');

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        locationDiv.textContent =
            'Геолокація недоступна в цьому браузері або середовищі.';
    }
}

function displayLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    locationDiv.textContent =
        `Широта: ${latitude}; довгота: ${longitude}`;
}

getMyLocation();