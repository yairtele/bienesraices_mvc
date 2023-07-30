(function() {
    const lat = -34.5829447;
    const lng = -58.4401848;
    const map = L.map('map').setView([lat, lng ], 13);
    let marker;

    //Use Provider and GeoCoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //The pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map);

    //Detect pin movement
    marker.on('moveend', function(event){
        marker = event.target;

        const position = marker.getLatLng();

        map.panTo(new L.LatLng(position.lat, position.lng));

        //Get street info when dragging the pin
        geocodeService.reverse().latlng(position, 13).run(function(error, result){
            console.log(result);

            marker.bindPopup(result.address.LongLabel);

            //Fill fields
            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lng').value = result?.latlng?.lat ?? '';
            document.querySelector('#lat').value = result?.latlng?.lng ?? '';
        });

    })
})()