<!-- // src/routes/login/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { Reload, ExclamationTriangle } from 'radix-icons-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let form;

	let isLoading = false;
	/**
	 * @type {null | string}
	 */
	let error = null;

	/**
	 * @param {any} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();
		isLoading = true;
		error = null;
		// Create a FormData object from the form
		const formData = new FormData(event.target);
		// Send the FormData object
		const response = await fetch('/login', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();

		if (data.status === 500) {
			error = data.message;
			isLoading = false;
			return;
		}

		// Check for the 'returnTo' query parameter in the URL
		goto('/');
	};
</script>

<main class="flex flex-col items-center justify-center h-screen p-5 bg-gray-100">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>
				<h1 class="text-2xl font-semibold tracking-tight">Login</h1>
			</Card.Title>
			<Card.Description>
				<p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
			</Card.Description>
		</Card.Header>
		<form method="post" use:enhance on:submit={handleSubmit}>
			<Card.Content class="flex flex-col space-y-4">
				<div class="flex flex-col space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						placeholder="name@example.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
					/>
				</div>
				<!-- <div class="flex flex-col space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						placeholder="Enter your password"
						type="password"
						disabled={isLoading}
					/>
				</div> -->
			</Card.Content>
			<Card.Footer>
				<Button type="submit" disabled={isLoading} class="w-full">
					{#if isLoading}
						<Reload class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Login</Button
				>
			</Card.Footer>
		</form>
	</Card.Root>
	<Alert.Root
		variant="destructive"
		class={`bg-white mt-4 ${error ? 'block' : 'hidden'} w-full max-w-md`}
	>
		<ExclamationTriangle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{error ? error : 'placeholder'}</Alert.Description>
	</Alert.Root>
</main>
