<template>
    <div class="card" v-for="c in comments">
        <div class="card-body">
            <p><strong>Username:</strong> {{ c.username }}</p>
            <p><strong>Text:</strong> {{ c.text }}</p>
            <p><strong>Rating:</strong> {{ c.rating }}</p>
            <p><strong>Status:</strong> {{ c.status }}</p>
            <button v-if="c.status === 'Processing'" class="accept-button" @click="acceptComment(c)">Accept</button>
            <button v-if="c.status === 'Processing'" class="reject-button" @click="rejectComment(c)">Reject</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const comments = ref([])
const role = ref('');
const username = ref('');

onMounted(() => {
    loadComments()
    checkUser();
})

function acceptComment(comment) {
    comment.status = "Accepted"

    axios.patch(`http://localhost:3000/comments/${comment.id}`, comment)
    .then(response => {
    })
    .catch(error => {
        console.error("Error putting the status of the button as rejected")
    })
}

function rejectComment(comment) {
    comment.status = "Rejected"

    axios.patch(`http://localhost:3000/comments/${comment.id}`, comment)
    .then(response => {

    })
    .catch(error => {
        console.error("Error putting the status of the button as rejected")
    })
}

function loadComments() {
    axios.get('http://localhost:3000/comments')
    .then(response => {
        comments.value = response.data
        console.log(comments.value);
    })
    .catch(error => {
        console.error("Error loading all comments");
    })
}

function checkUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    role.value = '';
    username.value = '';
    return;
  }
  getTokenInfo(token);
}

function getTokenInfo(token){
  axios.post('http://localhost:3000/users/verifyToken', { token })
      .then(response => {
        role.value = response.data.role;
        console.log(role.value)
        username.value = response.data.username;
        addUserCart();
      })
      .catch(() => {
        role.value = '';
        username.value = '';
      });
}
</script>

<style scoped>

.card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
    height: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    overflow: hidden;
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

.reject-button {
  background-color: #f44336; /* Red */
  color: white;
  margin-left: 10px;
}

.reject-button:hover {
  background-color: #e53935;
}

.accept-button {
  background-color: #4caf50; /* Green */
  color: white;
}

.accept-button:hover {
  background-color: #45a049;
}

.card-body {
    padding: 20px;
}
.card-body p {
    margin: 10px 0;
    font-size: 16px;
}
</style>