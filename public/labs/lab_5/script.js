function mapInit() {
  const mymap = L.map("mapid").setView([38.9870, -76.9378], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1Ijoiam9lbGlub2EiLCJhIjoiY2ttM3k4MWtsMHd2bTJ2cGk1bDMxdXdxbyJ9.pYpOPYab0agEflaS-rOLwQ",
    }
  ).addTo(mymap);
  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  const formInput = document.querySelector('#search-form');
  const searcher = document.querySelector('#search');
  const targList = document.querySelector('.target-list');
  const request = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json')
  const restaurants = await request.json();
  //console.log(restaurants)
  
  formInput.addEventListener('submit', async (event) => {
    targList.innerText ='';
    event.preventDefault();

    const filtered = restaurants.filter((record) => record.zip.includes(searcher.value)&& record.geocoded_column_1);
    console.table(filtered)
    const topFive = filtered.slice(0,5);
    
    topFive.forEach((item) => {
      const longLat = item.geocoded_column_1.coordinates;
      const marker = L.marker([longLat[1], longLat[0]]).addTo(mapObjectFromFunction);
      const appendItem = document.createElement('li');
      appendItem.classList.add('block');
      appendItem.classList.add('list-item');
      appendItem.innerHTML = `<div class="list-header is-size-5">${item.name}</div>
      <address class="is-size-6">${item.address_line_1}</address>`;
      targList.append(appendItem);
    });

    const {coordinates} = topFive[0]?.geocoded_column_1;
    mapObjectFromFunction.panTo([coordinates[1],coordinates[0]], 0);
  });
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;