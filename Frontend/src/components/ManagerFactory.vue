<template>
    <div>
    <h1>My factory</h1>
    <div class="factory-details">
      <strong>Name:</strong> <span>{{ factory.name }}</span> <br />
      <strong>Working hours:</strong> <span>{{ factory.workingHours }}</span> <br />
      <strong>Status:</strong> <span>{{ factory.status }}</span> <br />
      <strong>Location:</strong> <span>{{ factory.location }}</span> <br />
      <strong>Rating:</strong> <span>{{ factory.rating }}</span> <br />
    </div>
    <button @click="showAddWorkerForm = true">Add Worker</button>
        <div v-if="showAddWorkerForm" class="add-worker-form">
        <h2>Add Worker</h2>
        <form @submit.prevent="addWorker">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="newWorker.username" @blur="checkUsername" required>
                <span v-if="usernameExists" class="warning">Username already exists.</span>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="newWorker.password" required>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" @input="checkPasswordMatch" required>
                <span v-if="!passwordsMatch" class="warning">Passwords do not match.</span>
            </div>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="newWorker.name" required>
            </div>
            <div class="form-group">
                <label for="lastname">Lastname:</label>
                <input type="text" id="lastname" v-model="newWorker.lastname" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender:</label>
                <select v-model="newWorker.gender" required>
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
            </div>
            <div class="form-group">
                <label for="birthDate">Birthdate:</label>
                <input type="date" id="birthDate" v-model="newWorker.birthDate" required>
            </div>
            <button type="submit" class="submit-button" :disabled="usernameExists || !passwordsMatch">Submit</button>
            <button type="button" @click="showAddWorkerForm = false" class="cancel-button">Cancel</button>
        </form>
        </div>
    </div>
    <div>
        <h1>Purchases</h1>
        <div class="search-sort-controls">
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
        <div class="factory-details" v-if="!PurchasesError" v-for="p in filteredPurchases">
            <strong>Date:</strong> <span>{{ p.purchaseDate }}</span> <br/>
            <strong>Total price:</strong> <span>{{ p.totalPrice }}</span> <br/>
            <strong>Status:</strong> <span>{{ p.status }}</span> <br/>
            <strong>Customer name:</strong> <span>{{ p.customerName }}</span> <br/>
            <button v-if="p.status === 'Processing'" class="accept-button" @click="acceptPurchase(p)">Accept</button>
            <button v-if="p.status === 'Processing'" class="reject-button" @click="rejectPurchase(p)">Reject</button>
        </div>
        <h2 v-if="PurchasesError">No purchases!</h2>
    </div>
    <div>
        <h1>Buyers</h1>
        <div class="factory-details" v-if="!PurchasesError" v-for="b in buyers">
            <strong>Customer:</strong> <span>{{ b }}</span> <br/>
        </div>
        <h2 v-if="PurchasesError">No buyers!</h2>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const factory = ref({name: "", workingHours: "", status: "", location: "", rating: 0})
const factoryId = route.params.factoryId;
const purchases = ref([])
const buyers = ref([])
var PurchasesError = ref(false)
const showAddWorkerForm = ref(false);
const newWorker = ref({
    username:'',
    password:'',
    name:'',
    lastname:'',
    gender:'',
    birthDate:'',
    role:'',
    purchases: '',
    cart: '',
    factory: '',
    points: 0,
    customerType: ''
});
const confirmPassword = ref('');
const usernameExists = ref(false);
const passwordsMatch = ref(true);
const filteredPurchases = ref([]);

const minPrice = ref(null);
const maxPrice = ref(null);
const startDate = ref('');
const endDate = ref('');
const sortOption = ref('');

onMounted(() => {
    loadFactory()
    loadPurchases()
    loadBuyers()
})

function loadFactory() {
    axios.get(`http://localhost:3000/factories/${factoryId}`)
    .then((response) => {
        factory.value = response.data;
    })
    .catch(error => {
        console.log("Error loading the factory!")
    })
}

function loadPurchases() {
    axios.get(`http://localhost:3000/purchases/${factoryId}`)
    .then((response) => {
      const allPurchases = response.data;
      const processingPurchases = allPurchases.filter(purchase => purchase.status === 'Processing');
      const otherPurchases = allPurchases.filter(purchase => purchase.status !== 'Processing');
      purchases.value = [...processingPurchases, ...otherPurchases];
      filteredPurchases.value = purchases.value;
    })
    .catch(error => {
        PurchasesError.value = true;
        console.log("Error loading purchases: ", error);
    })
}

function loadBuyers() {
    axios.get(`http://localhost:3000/purchases/customer/${factoryId}`)
    .then((response) => {
        buyers.value = response.data;
        console.log(buyers.value);
    })
    .catch(error => {
        console.log("Error loading buyers: ", error);
    })
}

function checkUsername() {
  if (newWorker.value.username) {
    axios.get(`http://localhost:3000/users/check/` + newWorker.value.username)
      .then(response => {
        usernameExists.value = false;
      })
      .catch(error => {
        if (error.response.status === 409) {
          usernameExists.value = true;
        } else {
          console.error(error);
        }
      });
  }
}

function addWorker(){
    if (!passwordsMatch.value) {
        alert('Passwords do not match');
        return;
    }
    newWorker.value.role = "worker";
    newWorker.value.factory = factory.value.id;
    axios.post('http://localhost:3000/users', newWorker.value)
    .then(response => {
      showAddWorkerForm.value = false;
      alert('Worker added successfully!');
      resetNewWorkerForm();
    })
    .catch(error => {
      if (error.response.status === 409) {
        usernameExists.value = true;
      } else {
        alert('Adding a worker failed. Please try again.');
        console.error(error);
      }
    });
}

function checkPasswordMatch() {
  passwordsMatch.value = newWorker.value.password === confirmPassword.value;
}

function resetNewWorkerForm() {
    newWorker.value = {
        username:'',
        password:'',
        name:'',
        lastname:'',
        gender:'',
        birthDate:'',
        role:'',
        factory: ''
  };
}

function acceptPurchase(purchase) {
  purchase.status = "Accepted";
  axios.patch(`http://localhost:3000/purchases/${purchase.id}`, purchase)
    .then(() => {
      loadPurchases();
    })
    .catch((error) => {
      console.log("Error accepting purchase: ", error);
    });
}

function rejectPurchase(purchase) {
  const reason = prompt("Please enter the reason for rejection:");
  if (reason) {
    purchase.status = "Rejcted";
    axios.patch(`http://localhost:3000/purchases/${purchase.id}`, purchase)
      .then(() => {
        loadPurchases();
      })
      .catch((error) => {
        console.log("Error rejecting purchase: ", error);
      });
  }
}

function searchPurchases() {
    filteredPurchases.value = purchases.value.filter(purchase => {
        const priceMatch = (!minPrice.value || purchase.totalPrice >= minPrice.value) &&
                           (!maxPrice.value || purchase.totalPrice <= maxPrice.value);
        const dateMatch = (!startDate.value || new Date(purchase.purchaseDate) >= new Date(startDate.value)) &&
                          (!endDate.value || new Date(purchase.purchaseDate) <= new Date(endDate.value));
        return priceMatch && dateMatch;
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
.factory-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
}

.factory-details strong {
  font-weight: 600;
}

.factory-details span {
  margin-right: 10px;
}

.factory-details button {
  margin-top: 10px;
  margin-right: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

.add-worker-form {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #28a745;
}

.submit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  margin-left: 10px;
}

.cancel-button:hover {
  background-color: #c82333;
}

.accept-button {
  background-color: #4caf50; /* Green */
  color: white;
}

.accept-button:hover {
  background-color: #45a049;
}

.reject-button {
  background-color: #f44336; /* Red */
  color: white;
}

.reject-button:hover {
  background-color: #e53935;
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