<script setup lang="ts">
import Login from '../components/Login.vue';

</script>

<template>
  <main>
	  <login  class="mt-3"/>
	  <div class="container mt-4">
		  <p>New user, kindly
		  <router-link to="/register">register here</router-link>
		  </p>
	  </div>
  </main>
</template>
