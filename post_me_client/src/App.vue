<script setup lang="ts">
import { cacheExchange, createClient, dedupExchange, fetchExchange } from '@urql/core';
import { provideClient } from '@urql/vue';
import { RouterLink, RouterView } from 'vue-router'

const client = createClient({
	url: "http://localhost:4000/graphql",
	exchanges: [ dedupExchange, cacheExchange, fetchExchange ],
	fetchOptions: {
		credentials: "include",
	}
});

provideClient(client);
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar bg-dark navbar-dark navbar-expand-lg">
		  <div class="container-fluid">
			  <div class="navbar-brand">
				<RouterLink to="/">Post Me Daddy</RouterLink>
			  </div>
				<div class="collapse navbar-collapse">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item"> <RouterLink class="nav-link active" to="/">Home</RouterLink> </li>
						<li class="nav-item"> <RouterLink class="nav-link" to="/login">Login</RouterLink> </li>
					</ul>
				</div>
		  </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
