// app.js
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map);
let currentLatLng;

map.on('click', function(e) {
    currentLatLng = e.latlng;
    document.getElementById('marker-lat').value = currentLatLng.lat;
    document.getElementById('marker-lng').value = currentLatLng.lng;
});

async function loadMarkers() {
    const { data, error } = await supabase.from('markers').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else {
        markersLayer.clearLayers();
        document.getElementById('marker-table-body').innerHTML = '';
        data.forEach(marker => {
            addMarkerToMap(marker);
            addMarkerToTable(marker);
        });
    }
}

function addMarkerToMap(marker) {
    const popupContent = `
        <b>${marker.name}</b><br>
        Tọa độ: ${marker.lat}, ${marker.lng}<br>
        Ghi chú: ${marker.notes || 'N/A'}<br>
        ${marker.image_url ? `<img src="${marker.image_url}" alt="Image" style="width:100px;">` : ''}
    `;
    L.marker([marker.lat, marker.lng]).addTo(markersLayer).bindPopup(popupContent);
}

function addMarkerToTable(marker) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="border p-2">${marker.name}</td>
        <td class="border p-2">${marker.lat}</td>
        <td class="border p-2">${marker.lng}</td>
        <td class="border p-2">${new Date(marker.created_at).toLocaleString()}</td>
        <td class="border p-2"><button onclick="deleteMarker('${marker.id}')" class="bg-red-500 text-white p-1">Delete</button></td>
    `;
    document.getElementById('marker-table-body').appendChild(row);
}

async function addMarker() {
    const name = document.getElementById('marker-name').value;
    const lat = parseFloat(document.getElementById('marker-lat').value);
    const lng = parseFloat(document.getElementById('marker-lng').value);
    const notes = document.getElementById('marker-notes').value;
    const imageFile = document.getElementById('marker-image').files[0];
    let image_url = null;

    if (imageFile) {
        image_url = await uploadImage(imageFile);
    }

    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('markers').insert({
        user_id: user.user.id,
        lat,
        lng,
        name,
        notes,
        image_url
    }).select();
    if (error) alert(error.message);
    else {
        addMarkerToMap(data[0]);
        addMarkerToTable(data[0]);
        resetForm();
    }
}

async function deleteMarker(id) {
    const { error } = await supabase.from('markers').delete().eq('id', id);
    if (error) alert(error.message);
    else loadMarkers(); // Reload to update map and table
}

function resetForm() {
    document.getElementById('marker-name').value = '';
    document.getElementById('marker-lat').value = '';
    document.getElementById('marker-lng').value = '';
    document.getElementById('marker-notes').value = '';
    document.getElementById('marker-image').value = '';
}

// Realtime subscription
supabase.channel('markers-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'markers' }, payload => {
    if (payload.eventType === 'INSERT') {
        addMarkerToMap(payload.new);
        addMarkerToTable(payload.new);
    } else if (payload.eventType === 'DELETE') {
        loadMarkers();
    } else if (payload.eventType === 'UPDATE') {
        loadMarkers();
    }
}).subscribe();

document.getElementById('add-marker-btn').addEventListener('click', addMarker);