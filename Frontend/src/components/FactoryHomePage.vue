<template>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factory Cards</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div id="header">
            <div class="icons">
                <button class="profile-button" v-if="isLoggedIn" @click="goToProfile">
                    <img src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png">
                </button>
                <button class="all-users-button" v-if = "role === 'admin'" @click = "goToAdminAllUsers">
                    <img src="https://cdn-icons-png.flaticon.com/128/476/476863.png">
                </button>
                <button class="all-users-button" v-if = "role === 'manager'" @click = "goToManagerFactory">
                    <img src="https://cdn-icons-png.flaticon.com/128/3256/3256216.png">
                </button>
                <button class="all-users-button" v-if = "role === 'manager' || role === 'admin'" @click = "goToComments">
                    <img src="https://cdn-icons-png.flaticon.com/128/2190/2190552.png">
                </button>
                <button class="all-users-button" v-if = "role === 'worker'" @click = "goToWorkerFactory">
                    <img src="https://cdn-icons-png.flaticon.com/128/3256/3256216.png">
                </button>
                <button class="all-users-button" v-if = "role === 'admin'" @click="isAddModalShown = true">
                    <img src="https://cdn-icons-png.flaticon.com/128/4037/4037770.png">
                </button>
            </div>
            <button class="btn" v-if="!isLoggedIn" @click="goToLogin">Login</button>
            <button class="btn" v-if="!isLoggedIn" @click="goToRegister">Register</button>
            <button class="btn" v-if="isLoggedIn" @click="logout">Logout</button>
        </div>
        <!-- Search and Sort -->
        
        <div class="search-sort-container">
            <label for="sortCriteria" class="search-label">Search By:</label>
            <div class="search-section">
                <input type="text" v-model="searchName" placeholder="Factory Name">
                <input type="text" v-model="searchChocolate" placeholder="Chocolate Name">
                <input type="text" v-model="searchCity" placeholder="City">
                <label>Rating: </label>
                <input type="number" v-model="minRating" placeholder="Minimum Rating" min="0" max="5">
            </div>
            <div class="sort-section">
                <select v-model="searchKind">
                    <option value="">Chocolate Kind</option>
                    <option value="bar">Bar</option>
                    <option value="chips">Chips</option>
                    <option value="powder">Powder</option>
                </select>
                <select v-model="searchType">
                    <option value="">Chocolate Type</option>
                    <option value="milk">Milk</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                </select>
                <select v-model="searchStatus">
                    <option value="">Factory Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
                <button class="btn" @click="filterFactories">Filter</button>
            </div>
            <div class="sort-section">
                <label for="sortCriteria">Sort By: </label>
                <select v-model="sortCriteria">
                    <option value="name">Factory Name</option>
                    <option value="city">City</option>
                    <option value="rating">Rating</option>
                </select>
                <label for="sortOrder">Order: </label>
                <select v-model="sortOrder">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button class="btn" @click="sortFactories">Sort</button>
            </div>
        </div>
        <!-- Add Factory -->
        <div class="modal" v-if="isAddModalShown">
            <div class="modal-content">
                <span class="close" @click="isAddModalShown = false">&times;</span>
                <h2>Add Factory</h2>
                <form @submit.prevent="addFactory">
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" v-model="newFactory.name" required>
                    </div>
                    <div class="form-group">
                        <label for="workingHours">Working Hours:</label>
                        <input type="text" v-model="newFactory.workingHours" required>
                    </div>
                    <div class="form-group">
                        <label for="status">Status:</label>
                        <input type="text" v-model="newFactory.status" required>
                    </div>
                    <div class="form-group">
                        <label for="logo">Logo:</label>
                        <input type="text" v-model="newFactory.logo" required>
                    </div>
                    <div class="form-group">
                        <label for="manager">Manager:</label>
                        <select v-model="selectedManagerId" required>
                            <option v-for="manager in managers" :key="manager.id" :value="manager.id">
                                {{ manager.name }} {{ manager.lastname }}
                            </option>
                            <option value="new">Create new manager</option>
                        </select>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerName">Name:</label>
                        <input type="text" v-model="newManager.name" required>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerLastname">Lastname:</label>
                        <input type="text" v-model="newManager.lastname" required>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerUsername">Username:</label>
                        <input type="text" v-model="newManager.username" required>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerPassword">Password:</label>
                        <input type="text" v-model="newManager.password" required>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerBirthdate">Birthdate:</label>
                        <input type="date" v-model="newManager.birthDate" required>
                    </div>
                    <div v-if="selectedManagerId === 'new'" class="form-group">
                        <label for="newManagerGender">Gender:</label>
                        <select v-model="newManager.gender" required>
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="location">Location:</label>
                        <div id="map" class="map"></div>
                        <input type="text" v-model="location.street" placeholder="Street" required>
                        <input type="text" v-model="location.number" placeholder="Number" required>
                        <input type="text" v-model="location.city" placeholder="City" required>
                        <input type="text" v-model="location.postalCode" placeholder="Postal Code" required>
                        <input type="text" v-model="location.longitude" placeholder="Longitude" required>
                        <input type="text" v-model="location.latitude" placeholder="Latitude" required>
                    </div>
                    <button type="submit" class="submit-button">Submit</button>
                </form>
            </div>
        </div>
        <div id="cards-container">
            <div class="card" @click="handleClick(f.id)" v-for="f in filteredFactories" :key="f.id">
                <div class="card-header">
                    <img :src="f.logo" alt="Factory Logo">
                </div>
                <div class="card-body">
                    <h2>{{ f.name }}</h2>
                    <p><strong>Location:</strong> {{ f.location.street }} {{ f.location.number }}, {{ f.location.city }}</p>
                    <p><strong>Rating:</strong> {{ f.rating }}</p>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Location from '../../../Model/Location.js';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';

const router = useRouter();
const factories = ref([]);
const isLoggedIn = ref(false);
const role = ref('');
const username = ref('')
const factoryId = ref('')
const isAddModalShown = ref(false);
const newFactory = ref({ name: "", workingHours: "", status: "", location: "", logo: "", rating: 0 });
const managers = ref([]);
const selectedManagerId = ref(null);
const newManager = ref({
    username:'',
    password:'',
    name: '',
    lastname: '',
    birthDate:'',
    role:'manager',
    purchases: '',
    cart: '',
    factory: 0,
    points: 0,
    customerType: '',
    gender:''
});

const location = ref({ longitude: 0, latitude: 0, street: "", number: "", city: "", postalCode: "" });
let map;
let vectorSource;
let vectorLayer;

const filteredFactories = ref([]);
const searchName = ref('');
const searchChocolate = ref('');
const searchCity = ref('');
const minRating = ref(0);
const searchKind = ref('');
const searchType = ref('');
const searchStatus = ref('');
const sortCriteria = ref('name');
const sortOrder = ref('asc');

onMounted(()=>{
    loadFactories();
    checkLoginStatus();
    getManagers();
    initMap();
})

watch([searchName, searchChocolate, searchCity, minRating], () => {
    searchFactories();
});

watch(isAddModalShown, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initMap();
    });
  }
});

function handleClick(factoryId){
    router.push('/factory/' + factoryId);
    
}

function loadFactories(){
    axios.get('http://localhost:3000/factories').then((response)=>{
        factories.value = response.data;
        filteredFactories.value = factories.value;
    })
}

function goToComments() {
    router.push('commentsSection');
}

function goToManagerFactory() {
    router.push(`/manager/factory/${factoryId.value}`)
}

function goToWorkerFactory() {
    router.push(`/worker/factory/${factoryId.value}`)
}

function goToAdminAllUsers() {
    router.push('/users/all-users')
}

function goToProfile() {
    router.push(`/users/${username.value}`)
}

function goToLogin() {
    router.push('/login');
}

function goToRegister() {
    router.push('/register');
}

function addFactory() {
    newFactory.value.location = new Location(
          location.value.longitude,
          location.value.latitude,
          location.value.street,
          location.value.number,
          location.value.city,
          location.value.postalCode
        ).toJSON();
    if (selectedManagerId.value === "new") {
        // create new manager
        axios.post('http://localhost:3000/users', newManager.value)
            .then(response => {
                const createdManager = response.data.user;
                console.log(createdManager.id);
                createFactoryWithManager(createdManager.id);
            })
            .catch(error => {
                console.error("Error creating manager:", error);
            });
    } else {
        createFactoryWithManager(selectedManagerId.value);
    }
}

function createFactoryWithManager(managerId) {
    axios.post('http://localhost:3000/factories', newFactory.value)
        .then(response => {
            const createdFactory = response.data.factory;
            updateManagerWithFactory(managerId, createdFactory.id);
        })
        .catch(error => {
            console.error("Error adding factory:", error);
        });
}

function updateManagerWithFactory(managerId, factoryId) {
    newManager.value.factory = factoryId;
    axios.patch(`http://localhost:3000/users/` + managerId, newManager.value)
        .then(() => {
            isAddModalShown.value = false;
            resetNewFactoryForm();
            resetNewManagerForm();
            loadFactories();
        })
        .catch(error => {
            console.error("Error updating manager:", error);
        });
}

function resetNewFactoryForm() {
    newFactory.value = {
        name: "",
        workingHours: "",
        status: "",
        location: "",
        logo: "",
        rating: 0
    };
    selectedManagerId.value = null;
}

function resetNewManagerForm() {
    newManager.value = {
        username:'',
        password:'',
        name: '',
        lastname: '',
        birthDate:'',
        factory: 0,
        gender:''
    };
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('customerType');
    isLoggedIn.value = false;
    role.value = '';
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.post('http://localhost:3000/users/verifyToken', { token })
            .then(response => {
                isLoggedIn.value = true;
                role.value = response.data.role;
                username.value = response.data.username;
                factoryId.value = response.data.factory;
            })
            .catch(() => {
                isLoggedIn.value = false;
                role.value = '';
                username.value = '';
                localStorage.removeItem('token');
            });
    } else {
        isLoggedIn.value = false;
        role.value = '';
        username.value = '';
    }
}

function getManagers() {
    const searchParams = {
        role: 'manager'
    };

    axios.get('http://localhost:3000/users/filter', { params: searchParams })
        .then(response => {
            managers.value = response.data.filter(manager => manager.factory === 0);
        })
        .catch(error => {
            console.error('Error filtering users', error);
        });
}

function searchFactories() {
    let result = factories.value;

    if (searchName.value) {
        result = result.filter(factory => factory.name.toLowerCase().includes(searchName.value.toLowerCase()));
    }

    if (searchChocolate.value) {
        axios.get('http://localhost:3000/chocolates')
            .then(response => {
                const chocolates = response.data;
                const factoryIds = chocolates
                    .filter(chocolate => chocolate.name.toLowerCase().includes(searchChocolate.value.toLowerCase()))
                    .map(chocolate => chocolate.factoryId);
                result = result.filter(factory => factoryIds.includes(factory.id));
                filteredFactories.value = result;
            });
        return;
    }

    if (searchCity.value) {
        result = result.filter(factory => factory.location.city.toLowerCase().includes(searchCity.value.toLowerCase()));
    }

    if (minRating.value > 0) {
        result = result.filter(factory => factory.rating >= minRating.value);
    }

    filteredFactories.value = result;
}

function sortFactories() {
    filteredFactories.value = filteredFactories.value.sort((a, b) => {
        if (sortOrder.value === 'asc') {
            return a[sortCriteria.value] > b[sortCriteria.value] ? 1 : -1;
        } else {
            return a[sortCriteria.value] < b[sortCriteria.value] ? 1 : -1;
        }
    });
}


function filterFactories() {
    filteredFactories.value = factories.value;
    if (searchKind.value) {
        axios.get('http://localhost:3000/chocolates')
            .then(response => {
                const chocolates = response.data;
                const factoryIds = chocolates
                    .filter(chocolate => chocolate.kind === searchKind.value)
                    .map(chocolate => chocolate.factoryId);
                filteredFactories.value = filteredFactories.value.filter(factory => factoryIds.includes(factory.id));
            });
    }

    if (searchType.value) {
        axios.get('http://localhost:3000/chocolates')
            .then(response => {
                const chocolates = response.data;
                const factoryIds = chocolates
                    .filter(chocolate => chocolate.type === searchType.value)
                    .map(chocolate => chocolate.factoryId);
                filteredFactories.value = filteredFactories.value.filter(factory => factoryIds.includes(factory.id));
            });
}

    if (searchStatus.value) {
        filteredFactories.value = filteredFactories.value.filter(factory => factory.status === searchStatus.value);
    }
}

function initMap() {
  const noviSadCoords = [19.8335, 45.2671]; // Longitude and Latitude for Novi Sad
  vectorSource = new VectorSource();

  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
      })
    })
  });

  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer
    ],
    view: new View({
      center: fromLonLat(noviSadCoords),
      zoom: 12
    })
  });

  map.on('singleclick', function (evt) {
    const coordinates = toLonLat(evt.coordinate);
    location.value.longitude = coordinates[0];
    location.value.latitude = coordinates[1];
    addMarker(evt.coordinate);
    getAddressFromCoordinates(coordinates[1], coordinates[0]);
  });
}

function addMarker(coordinate) {
  vectorSource.clear(); // Clear existing markers
  const marker = new Feature({
    geometry: new Point(coordinate)
  });
  vectorSource.addFeature(marker);
}

function getAddressFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  axios.get(url)
    .then(response => {
      const address = response.data.address;
      location.value.street = address.road || "";
      location.value.number = address.house_number || "";
      location.value.city = address.city || address.town || address.village || "";
      location.value.postalCode = address.postcode || "";
    })
    .catch(error => {
      console.error('Error fetching address:', error);
    });
}
</script>

<style scoped>

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
}

.icons {
    margin-right: auto;
    justify-content: left;
}

#header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
}

.all-users-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 10
}

.all-users-button img {
    width: 40px; 
    height: 40px; 
}

.profile-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 10;
    text-align: left;
    margin-right: auto;
}

.profile-button img {
    width: 40px; 
    height: 40px; 
}

.btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
}

.btn:hover {
    background-color: #0056b3;
}

#cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
    height: 300px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-5px);
}

.card-header {
    width: 100%;
    height: 150px;
}

.card-header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.card-body {
    padding: 20px;
}

.card-body h2 {
    margin: 0 0 20px;
    font-size: 24px;
}

.card-body p {
    margin: 10px 0;
    font-size: 16px;
}

.card-body p.location {
    margin-top: 20px;
}

.card-body p.rating {
    margin-bottom: 20px;
}

.modal {
  display: block; /* show */
  position: fixed;
  z-index: 9999; /* on top od other content */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* scroll */
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 2% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.map {
  width: 100%;
  height: 400px;
}

.search-sort-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.search-section, .sort-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.search-section {
    justify-content: center;
}

.search-label {
    align-self: center;
    margin-bottom: 10px;
}

.search-section input, .sort-section select {
    margin-right: 10px;
}

.search-section input {
    margin-left: 10px;
}

.search-section button, .sort-section button {
    margin-left: 10px;
}

.sort-section {
    justify-content: center;
}
</style>