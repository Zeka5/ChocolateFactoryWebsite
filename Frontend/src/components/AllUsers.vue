<template>
    <div id="web-shop">
		<h1>All registered users</h1>
        
        <div class="container">
            <div class="inputdugme">
            <h2>
                Search by:
            </h2>
            <div>
                <label>Username:</label>
                <input type="text" v-model="userNameSearch">
            </div>
            <div>
                <label>First name:</label>
                <input type="text" v-model="firstNameSearch">
            </div>
            <div>
                <label>Last name:</label>
                <input type="text" v-model="lastNameSearch">
            </div>
            <div>
                <button v-on:click="searchUsers()">Search</button>
            </div>
        </div>
        <div class="inputdugme">
            <h2>
                Filter by role:
            </h2>
            <div>
                <select id="comboBoxValue">
                    <option value="none">None</option>
                    <option value="customer">Customer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                    <option value="employee">Employee</option>
                </select>
            </div>
            <div>
                <button v-on:click="filterUsers()">Filter</button>
            </div>
            <h2>
                Filter by customer type:
            </h2>
            <div>
                <select id="customerTypeComboBoxValue">
                    <option value="none">None</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                </select>
            </div>
            <div>
                <button v-on:click="filterUsersByCustomerType()">Filter</button>
            </div>
        </div>

        <div class="inputdugme">
            <h2>
                Sort by:
            </h2>
            
            <div>
                <select id="sortComboBoxValue">
                    <option value="none">None</option>
                    <option value="name">First name</option>
                    <option value="lastname">Last name</option>
                    <option value="username">Username</option>
                    <option value="points">Points</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px;">
                <button v-on:click="sortUsers()">Sort Ascending</button>
                <button v-on:click="sortDescendingUsers()">Sort Descending</button>
            </div>

        </div>

        </div>

        <br/>
        <br/>
		<div id="products">
            <table id="tabela" border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last name</th>
                        <th>Gender</th>
                        <th>Birth date</th>
                        <th>Role</th>
                        <th>Customer type</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tr v-for="u in users">
                            <td>{{ u.name }}</td>
                            <td>{{ u.lastname }}</td>
                            <td>{{ u.gender }}</td>
                            <td>{{ u.birthDate }}</td>
                            <td>{{ u.role }}</td>
                            <td>{{ u.customerType }}</td>
                            <td>{{ u.points }}</td>
                        </tr>
            </table>
        </div>
	</div>

    <h1>Suspicious users</h1>
    <h2 v-if="suspiciousUsers.length === 0">No suspicious users!</h2>
      <div class="comment-card" v-for="s in suspiciousUsers">
          <div class="comment-card-body">
              <p><strong>Username:</strong> {{ s.username }}</p>
              <p><strong>Gender:</strong> {{ s.gender }}</p>
              <p><strong>Birithdate:</strong> {{ s.birthDate }}</p>
              <button @click="blockUser(s)" class="submit-button">Block</button>
          </div>
      </div>

    <h1>Blocked users</h1>
    <h2 v-if="blockedUsers.length === 0">No blocked users!</h2>
      <div class="comment-card" v-for="b in blockedUsers">
          <div class="comment-card-body">
              <p><strong>Username:</strong> {{ b.username }}</p>
              <p><strong>Gender:</strong> {{ b.gender }}</p>
              <p><strong>Birithdate:</strong> {{ b.birthDate }}</p>
          </div>
      </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const users = ref([])
const user = ref({username: "", name: "", lastname: "", gender: "", birthDate: "", role: "", points: 0, customerType: ""});
const userNameSearch=ref("");
const firstNameSearch=ref("");
const lastNameSearch=ref("");
const suspiciousUsers = ref([])
const blockedUsers = ref([])

onMounted(() => {
    loadUsers()
    loadSuspiciousUsers();
    loadBlockedUsers();
})

function loadBlockedUsers() {
    axios.get('http://localhost:3000/users/blockedUsers')
    .then(response => {
        blockedUsers.value = response.data
    })
    .catch(error => {
        console.error("Error loading suspicious users")
    })
}

function loadSuspiciousUsers() {
    axios.get('http://localhost:3000/users/suspiciousUsers')
    .then(response => {
        suspiciousUsers.value = response.data
    })
    .catch(error => {
        console.error("Error loading suspicious users")
    })
}

function blockUser(user) {
    user.blocked = true
    user.suspicious = false
    axios.patch(`http://localhost:3000/users/${user.id}`, user)
    .then(response => {
        loadSuspiciousUsers();
        loadBlockedUsers();
    })
    .catch(error => {
        console.error("Error blocking a user")
    })
}

function loadUsers() {
    axios.get('http://localhost:3000/users/').then((response) => {
        users.value = response.data
    }).catch(error => {
        console.log("Error loading all users")
    });
}

function searchUsers() {
  const searchParams = {
    users: users.value,
    username: userNameSearch.value,
    firstName: firstNameSearch.value,
    lastName: lastNameSearch.value,
  };

  axios.get('http://localhost:3000/users/search', { params: searchParams })
    .then(response => {
      users.value = response.data;
    })
    .catch(error => {
      console.error('Error searching users:', error);
    }); 
}

function sortUsers() {
  var e = document.getElementById("sortComboBoxValue");
  const sortParams = {
    users: users.value,
    sortBy: e.value,
  };

  axios.get('http://localhost:3000/users/sort', { params: sortParams })
    .then(response => {
        users.value = response.data;
        console.log(user.value)
    })
    .catch(error => {
      console.error('Error sorting users:', error);
    }); 
}

function sortDescendingUsers() {
    var e = document.getElementById("sortComboBoxValue");
  const sortParams = {
    users: users.value,
    sortBy: e.value,
  };

  axios.get('http://localhost:3000/users/sortDescending', { params: sortParams })
    .then(response => {
        users.value = response.data;
        console.log(user.value)
    })
    .catch(error => {
      console.error('Error sorting users:', error);
    });
}

function filterUsers() {
    var e = document.getElementById("comboBoxValue");

    const searchParams = {
        role: e.value
    };

    axios.get('http://localhost:3000/users/filter', {params: searchParams})
    .then(response => {
        users.value = response.data
    })
    .catch(error => {
        console.error('Error filtering users', error)
    })
}

function filterUsersByCustomerType() {
    var e = document.getElementById("customerTypeComboBoxValue")

    const searchParams = {
        customerType: e.value,
    }

    axios.get('http://localhost:3000/users/filterByCustomerType', {params: searchParams})
    .then(response => {
        users.value = response.data
    })
    .catch(error => {
        console.error('Error filtering users', error)
    })
}
</script>

<style scoped>

.container {
    display: flex;
}

.comment-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 600px;
    height: 160px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    overflow: hidden;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #FF0000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-card-body {
    padding: 20px;
}
.comment-card-body p {
    margin: 10px 0;
    font-size: 16px;
}

</style>