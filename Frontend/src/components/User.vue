<template>
  <div>
    <div class="user-details">
      <strong>Username:</strong> <span>{{ user.username }}</span><br>
      <strong>Name:</strong> <span>{{ user.name }}</span><br>
      <strong>Lastname:</strong> <span>{{ user.lastname }}</span><br>
      <strong>Gender:</strong> <span>{{ user.gender }}</span><br>
      <strong>Birth Date:</strong> <span>{{ user.birthDate }}</span><br>
      <strong>Role:</strong> <span>{{ user.role }}</span><br>
      <strong>Points:</strong> <span>{{ user.points }}</span><br>
      <strong>Customer Type:</strong> <span>{{ user.customerType }}</span><br>
      <button @click="updateUserModal(user)" class="update-button">Update</button>
    </div>

    <div v-if="user.role === 'customer'" class="purchases-section">
      <h2>Purchases</h2>
      <div class="search-sort-controls">
        <input type="text" v-model="searchName" placeholder="Search by Factory Name" class="search-input">
        <input type="number" v-model.number="minPrice" placeholder="Min price" class="search-input">
        <input type="number" v-model.number="maxPrice" placeholder="Max price" class="search-input">
        <input type="date" v-model="startDate" class="search-input">
        <input type="date" v-model="endDate" class="search-input">
        <button @click="searchPurchases" class="search-button">Search</button>
        <select v-model="sortOption" class="sort-select">
          <option value="">Sort by</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="dateAsc">Date: Oldest to Newest</option>
          <option value="dateDesc">Date: Newest to Oldest</option>
        </select>
        <button @click="sortPurchases" class="sort-button">Sort</button>
      </div>
      <ul class="purchases-list">
        <li v-for="purchase in filteredPurchases" :key="purchase.id" class="purchase-item">
          <div class="purchase-details">
            <span><strong>Purchase ID:</strong> {{ purchase.id }}</span>
            <span><strong>Total Price:</strong> ${{ purchase.totalPrice }}</span>
            <span><strong>Purchase Date:</strong> {{ purchase.purchaseDate }}</span>
            <span><strong>Status:</strong> {{ purchase.status }}</span>
            <span><strong>Factory:</strong> {{ factoryMapping[purchase.factoryId] }}</span>
            <button v-if="purchase.status === 'Processing'" @click="cancelPurchase(purchase)" class="cancel-button">Cancel</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="modal" v-if="isUpdateModalShown">
      <div class="modal-content">
        <span class="close" @click="isUpdateModalShown = false">&times;</span>
        <h2>Update User</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" v-model="updatedUser.username" required>
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="updatedUser.name" required>
          </div>
          <div class="form-group">
            <label for="lastname">Lastname:</label>
            <input type="text" v-model="updatedUser.lastname" required>
          </div>
          <div class="form-group">
            <label for="gender">Gender:</label>
            <input type="text" v-model="updatedUser.gender" required>
          </div>
          <div class="form-group">
            <label for="birthDate">Birth Date:</label>
            <input type="date" v-model="updatedUser.birthDate" required>
          </div>
          <div class="form-group">
            <label for="role">Role:</label>
            <input type="text" v-model="updatedUser.role" required>
          </div>
          <div class="form-group">
            <label for="points">Points:</label>
            <input type="text" v-model="updatedUser.points" required>
          </div>
          <div class="form-group">
            <label for="customerType">Customer Type:</label>
            <input type="text" v-model="updatedUser.customerType" required>
          </div>
          <button type="submit" class="submit-button">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {onMounted, ref} from 'vue';
import { useRouter, useRoute } from 'vue-router';

const updatedUser = ref({});
const isUpdateModalShown = ref(false);
const route = useRoute();
const router = useRouter();

const user = ref({id: 0, username: "", name: "", lastname: "", gender: "", birthDate: "", role: "", purchases:[], points: 0, customerType: "", suspicious: false, blocked: false});
const users = ref([])
const username = route.params.username;
const purchases = ref([]);
const filteredPurchases = ref([]);
const factories = ref([]);
const factoryMapping = ref({}); //za filtriranje po imenu fabrike

const searchName = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const startDate = ref('');
const endDate = ref('');
const sortOption = ref('');
const orderCancellation = ref({username: "", date: new Date()})

onMounted(() => {
    loadUser()
})

function loadUser() {
    axios.get('http://localhost:3000/users/' + username).then((response)=>{
      user.value = response.data;
      console.log(user.value.purchases);
      loadPurchases();
      loadFactories();
    }).catch(error => {
        console.error("Error loading the profile");
    });
}

function loadPurchases(){
  axios.get('http://localhost:3000/purchases/').then((response)=>{
      const allPurchases = response.data.filter(purchase => 
        user.value.purchases.includes(purchase.id)
      );
      const processingPurchases = allPurchases.filter(purchase => purchase.status === 'Processing');
      const otherPurchases = allPurchases.filter(purchase => purchase.status !== 'Processing');
      purchases.value = [...processingPurchases, ...otherPurchases];
      filteredPurchases.value = purchases.value;
    }).catch(error => {
        console.error("Error loading user purchases");
    });
}

function loadFactories(){
  axios.get('http://localhost:3000/factories/').then((response) => {
    const allFactories = response.data;
    const factoryIds = purchases.value.map(purchase => purchase.factoryId);

    factories.value = allFactories.filter(factory => factoryIds.includes(factory.id));
    //koristimo mapu radi lakseg filtriranja kupovina po imenu fabrike
    factoryMapping.value = Object.fromEntries(factories.value.map(factory => [factory.id, factory.name]));
    console.log(factories.value);
    })
    .catch(error => {
    console.error("Error loading factories:", error);
    });
}

function updateUser(){
    axios.patch('http://localhost:3000/users/' + updatedUser.value.id,
    updatedUser.value).then(response =>{
        user.value = response.data.user
        isUpdateModalShown.value = false;
    })
    .catch(error => {
        console.error("Error updating the user:", error);
    });
}

function updateUserModal(user){
    updatedUser.value = { ...user };
    isUpdateModalShown.value = true;
}

function cancelPurchase(purchase) {
  axios.delete(`http://localhost:3000/purchases/` + purchase.id).then(() => {
    updateUserPoints(purchase);
    purchases.value = purchases.value.filter(p => p.id !== purchase.id);
    loadPurchases()

    orderCancellation.value.username = username
    orderCancellation.value.date = new Date()


    axios.post(`http://localhost:3000/orderCancellation`, orderCancellation.value)
    .then(response => {

      axios.get(`http://localhost:3000/orderCancellation/isSuspicious/${username}`)
      .then(response => {
        if (Boolean(response.data)) {
          alert(username + " is suspicious!")
        }
      })
      .catch(error => {
        console.log("Error checking for suspicious customers")
      })

    })
    .catch(error => {
      console.error("Error adding new order cancellation")
    })

  }).catch(error => {
    console.error("Error canceling the purchase:", error);
  });
}

function updateUserPoints(purchase){
  user.value.purchases = user.value.purchases.filter(id => id !== purchase.id);
  user.value.points -= purchase.totalPrice*133*4/1000;
  if(user.value.points < 0){
    user.value.points = 0;
  }

  if (user.value.points >= 100) {
      user.value.customerType = "Gold";
    } else if (user.value.points >= 50) {
      user.value.customerType = "Silver";
    } else {
      user.value.customerType = "Bronze";
    }

  axios.patch('http://localhost:3000/users/' + user.value.id, user.value);
}

function searchPurchases() {
    filteredPurchases.value = purchases.value.filter(purchase => {
        const factoryName = factoryMapping.value[purchase.factoryId] || '';
        const nameMatch = !searchName.value || factoryName.includes(searchName.value);
        const priceMatch = (!minPrice.value || purchase.totalPrice >= minPrice.value) &&
                           (!maxPrice.value || purchase.totalPrice <= maxPrice.value);
        const dateMatch = (!startDate.value || new Date(purchase.purchaseDate) >= new Date(startDate.value)) &&
                          (!endDate.value || new Date(purchase.purchaseDate) <= new Date(endDate.value));
        return nameMatch && priceMatch && dateMatch;
    });
}

function sortPurchases() {
    filteredPurchases.value = [...filteredPurchases.value].sort((a, b) => {
        if (sortOption.value === 'priceAsc') {
            return a.totalPrice - b.totalPrice;
        } else if (sortOption.value === 'priceDesc') {
            return b.totalPrice - a.totalPrice;
        } else if (sortOption.value === 'dateAsc') {
            return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        } else if (sortOption.value === 'dateDesc') {
            return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        }
        return 0;
    });
}
</script>

<style scoped>
.user-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
}

.user-details strong {
  font-weight: 600;
}

.user-details span {
  margin-right: 10px;
}

.purchases-section {
  margin-bottom: 20px;
}

.purchases-list {
  list-style: none;
  padding: 0;
}

.purchase-item {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.purchase-details {
  display: flex;
  flex-direction: column;
}

.purchase-details span {
  margin-bottom: 5px;
}

.purchase-details strong {
  font-weight: 600;
}

.update-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
  width: 100px;
  height: 30px;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
  width: 100px;
}

.cancel-button:hover {
  background-color: #c82333;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* scroll */
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  margin: 2% auto;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 20px;
  cursor: pointer;
}

h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.search-sort-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input, .sort-select, .search-button, .sort-button {
  padding: 5px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
</style>
