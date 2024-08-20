<template>
    <!-- Factory Info -->
  <div class="factory-details">
    <div class="factory-header">
      <img :src="factory.logo" alt="Factory Logo" class="factory-logo">
      <h1 class="factory-name">{{ factory.name }}</h1>
    </div>
    <div class="factory-body">
      <p><strong>Working Hours:</strong> {{ factory.workingHours }}</p>
      <p><strong>Status:</strong> {{ factory.status }}</p>
      <p><strong>Location:</strong> {{ factory.location.street }} {{ factory.location.number }}, {{ factory.location.city }}</p>
      <p><strong>Rating:</strong> {{ factory.rating }}</p>
    </div>
    <!-- All Chocolates -->
    <div class="chocolates-section">
      <h2>Chocolates</h2>
      <div class="chocolates-container">
        <div class="chocolate-card" v-for="choc in chocolates" :key="choc.id">
          <img :src="choc.image" alt="Chocolate Image" class="chocolate-image">
          <div class="chocolate-info">
            <h3>{{ choc.name }}</h3>
            <p><strong>Price:</strong> ${{ choc.price }}</p>
            <button @click="decrementQuantity(choc)" class="quantity-button">-</button>
            <input type="number" v-model.number="choc.selectedQuantity" min="0" class="quantity-input">
            <button @click="incrementQuantity(choc)" class="quantity-button">+</button>
            <button 
              @click="updateQuantity(choc)"
              :disabled="choc.selectedQuantity === choc.quantity" 
              class="update-button">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const factory = ref({ name: "", workingHours: "", status: "", location: "", logo: "", rating: 0 });
const factoryId = route.params.factoryId;
const role = ref('');
const chocolates = ref([]);

onMounted(()=>{
    checkUser();
    loadFactory();
    loadChocolates();
});

function checkUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    role.value = '';
    return;
  }
  getTokenInfo(token);
}

function getTokenInfo(token){
  axios.post('http://localhost:3000/users/verifyToken', { token })
      .then(response => {
        role.value = response.data.role;
      })
      .catch(() => {
        role.value = '';
      });
}

function loadFactory(){
    axios.get('http://localhost:3000/factories/' + factoryId).then((response)=>{
        factory.value = response.data;
        loadChocolates();
    });
}

function loadChocolates(){
    axios.get('http://localhost:3000/factories/' + factoryId + "/chocolates").then((response)=>{
      chocolates.value = response.data.map(choc => ({
        ...choc,
        selectedQuantity: choc.quantity
      }));
    });
}

function incrementQuantity(chocolate) {
  chocolate.selectedQuantity++;
}

function decrementQuantity(chocolate) {
  if (chocolate.selectedQuantity > 0) {
    chocolate.selectedQuantity--;
  }
}

function updateQuantity(chocolate) {
  const updatedChocolate = {
    ...chocolate,
    quantity: chocolate.selectedQuantity
  };
  if(updatedChocolate.quantity === 0){
        updatedChocolate.status = "Out of stock"
    } else{
        updatedChocolate.status = "In stock"
    }
  axios.patch(`http://localhost:3000/chocolates/${chocolate.id}`, updatedChocolate)
    .then(() => {
      chocolate.quantity = chocolate.selectedQuantity;
      console.log("Chocolate quantity updated successfully");
    })
    .catch(error => {
      console.log("Error updating chocolate quantity: ", error);
    });
}
</script>

<style scoped>
.factory-details {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
    position: relative;
}

.factory-header {
    text-align: center;
    margin-bottom: 20px;
}

.factory-logo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 20px;
}

.factory-name {
    font-size: 32px;
    margin: 0;
}

.factory-body {
    font-size: 18px;
}

.factory-body p {
    margin: 10px 0;
}

.factory-body strong {
    display: inline-block;
    width: 150px;
}

.chocolates-section {
    margin-top: 40px;
}

.chocolates-section h2 {
    text-align: center;
    margin-bottom: 20px;
}

.quantity-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 10px;
}

.quantity-input {
  width: 30px;
  text-align: center;
  margin: 0 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.chocolates-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.chocolate-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s;
    position: relative;
}

.chocolate-card:hover {
    transform: translateY(-5px);
}

.chocolate-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.chocolate-info {
    padding: 10px;
    text-align: center;
}

.chocolate-info h3 {
    font-size: 20px;
    margin: 10px 0;
}

.chocolate-info p {
    margin: 0;
    font-size: 16px;
}
.chocolate-card:hover{
  display: block;
}

.update-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
  margin-top: 10px;
  margin-left: 10px;
}

.update-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

</style>