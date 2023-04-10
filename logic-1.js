// Get the earthquake data from the USGS API
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
fetch(url)
  .then(response => response.json())
  .then(data => {

    // Set the initial view of the map
    const map = L.map('map').setView([40, -100], 4);

    // Define the style for each circle marker based on the earthquake depth and magnitude
    function getCircleStyle(depth, mag) {
      const color = depth > 50 ? '#FF5733' : '#33FF7A';
      return {
        radius: mag * 3,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }

    // Add the circle markers to the map
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, getCircleStyle(feature.geometry.coordinates[2], feature.properties.mag));
      },
      onEachFeature: function(feature, layer) {
        // Add a popup to show more information about each earthquake when clicked
        layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(map);

    // Add a legend to the map to explain the circle marker colors and sizes
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 50];
      const colors = ['#33FF7A', '#FF5733'];
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(map);
  })
  .catch(error => {
    console.error('Error:', error);
  });
