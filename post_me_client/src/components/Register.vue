<script setup lang="ts">
import { ref } from 'vue';
import { useMutation  } from '@urql/vue';
/* import { graphql } from '../gql'; */
import { toErrorMap } from "../utils/toErrorMap"
import router from '@/router';

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


	const userRegisterError = {
		state: ref(false),
		message: ref(""),
	}

	const onSubmit = () => {
		console.log("form submitted", username.value, password.value)
		const variables = {
			username: username.value,
			password: password.value,
		}
		registerMutation.executeMutation(variables).then(result => {
			if (result.data?.register.errors) {
				userRegisterError.state.value = true
				const errorMessage = toErrorMap(result.data?.register.errors);
				for (const key in errorMessage) {
					if (errorMessage[key] !== undefined) {
						userRegisterError.message.value = errorMessage[key];
					}
				}
				/* userRegisterError.message.value; */
				/* console.log(toErrorMap(result.data?.register.errors)) */
			} else {
				router.push("/")
			}
			/* console.log("after execution: ", result.data?.register as UserResponse); */
		})
		console.log("data: ", registerMutation.data.value);
		console.log("error: ", registerMutation.error.value);
		console.log("fetching: ", registerMutation.fetching.value);
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
			<button type="submit" class="btn btn-success">Submit</button>
		</form>
		<div class="container mt-4">
			<p v-if="userRegisterError.state.value">{{ userRegisterError.message.value }}</p>
		</div>
		<!-- <div class="container">
			<div v-if="registerMutation.fetching">
				Loading...
			</div>
			<div v-else-if="registerMutation.error">
				Oh no ... {{ registerMutation.error }}
			</div>
			<div v-else="registerMutation.data">
				<div v-if="registerMutation.data">
					some user data: {{ registerMutation.data }}
				</div>
			</div>
		</div> -->
	</div>
</template>
