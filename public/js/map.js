// public js map.js code


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // Container ID
    // Choose from mapbox's core style or make your own 
    style: "mapbox://styles/mapbox/satellite-streets-v12", // Style URL
    center: listing.geometry.coordinates, // Starting position [longitude, latitude]
    zoom: 9 // Starting zoom level
});

console.log(listing.geometry.coordinates);

// Adding a default marker
const marker = new mapboxgl.Marker({color: "#fe424d"})
    .setLngLat(listing.geometry.coordinates) // Lisiting.geometry.coordinates
    .setPopup(
        new mapboxgl.Popup({offset:25}).setHTML(
            `<h5><b><i><u>${listing.location}</u></i></b></h5>
            <p><i>Exact location provided after booking</i></p>`
        )
    )
    .addTo(map);