<script setup lang="ts">
import { ref } from 'vue';
import { useMutation  } from '@urql/vue';
/* import { graphql } from '../gql'; */
import { toErrorMap } from "../utils/toErrorMap"
import router from '@/router';

	const username = ref("");
	const password = ref("");

	const loginMutation = useMutation(`
	mutation Login($options: UsernamePasswordInput!) {
	  login(options: $options) {
		errors {
		  message
		  field
		}
		user {
		  id
		  username
		}
	  }
	}`);


	const userLoginError = {
		state: ref(false),
		message: ref(""),
	}

	const onSubmit = () => {
		console.log("form submitted", username.value, password.value)
		const variables = {
			username: username.value,
			password: password.value,
		}
		loginMutation.executeMutation({ options: variables }).then(result => {
			if (result.data?.login.errors) {
				userLoginError.state.value = true
				const errorMessage = toErrorMap(result.data?.login.errors);
				for (const key in errorMessage) {
					if (errorMessage[key] !== undefined) {
						userLoginError.message.value = errorMessage[key];
					}
				}
			} else {
				router.push("/")
			}
		})
		console.log("data: ", loginMutation.data.value);
		console.log("error: ", loginMutation.error.value);
		console.log("fetching: ", loginMutation.fetching.value);
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
			<p v-if="userLoginError.state.value">{{ userLoginError.message.value }}</p>
		</div>
	</div>
</template>
