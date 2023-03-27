<script setup lang="ts">
import Register from '../components/Register.vue';

</script>

<template>
  <main>
	  <register class="mt-3" />
	  <div class="container mt-4">
		  <p>Already a user, kindly
		  <router-link to="/login">login here</router-link>
		  </p>
	  </div>
  </main>
</template>
