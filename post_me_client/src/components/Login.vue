<script setup lang="ts">
import { ref } from 'vue';
import { useMutation  } from '@urql/vue';

	const username = ref("");
	const password = ref("");

	const registerMutation = useMutation(`
		mutation Register($username: String!, $password: String!) {
		  register(options: { username: $username, password: $password }) {
			errors {
			  field
			  message
			}
			user {
			  id
			  createdAt
			  username
			}
		  }
		}`
	);

	const userFetching = registerMutation.fetching;
	const userData = registerMutation.data;
	const userError = registerMutation.error;

	const onSubmit = () => {
		console.log("form submitted", username.value, password.value)
		const variables = {
			username: username.value,
			password: password.value,
		}
		registerMutation.executeMutation(variables).then(result => {
			console.log(result);
		})
		console.log("data: ", registerMutation.data);
		console.log("error: ", registerMutation.error);
		console.log("fetching: ", registerMutation.fetching);
	}
</script>

<template>
	<div class="container-xl container-lg container-md">
		<form @submit.prevent="onSubmit">
			<div class="input-group mb-3">
				<span for="username" class="input-group-text">UserName</span>
				<input type="input" v-model="username" id="username" aria-label="username" />
			</div>
			<div class="input-group mb-3">
				<span for="userpass" class="input-group-text">Password</span>
				<input type="password" v-model="password" id="userpass" aria-label="password" />
			</div>
			<button type="submit" class="btn btn-primary">Submit</button>
		</form>
		<div class="container">
			<div v-if="userFetching">
				Loading...
			</div>
			<div v-else-if="userError">
				Oh no ... {{ userError}}
			</div>
			<div v-else="userData">
				<div v-if="userData">
					some user data: {{ userData }}
				</div>
			</div>
		</div>
	</div>
</template>
