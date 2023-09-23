<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Reload } from 'radix-icons-svelte';

	export let show = false;
	export let supabase: SupabaseClient;

	let feedback = '';
	let loading = false;

	async function handleFeedbackSubmit() {
		loading = true;
		supabase
			.from('feedback')
			.insert({ feedback: feedback })
			.then(({ data, error }) => {
				if (error) {
					console.log(error);
				} else {
					console.log(data);
				}
			});
		loading = false;
		show = false;
	}
</script>

<Dialog.Root open={show} onOpenChange={(e) => (show = e.detail)}>
	<Dialog.Content>
		<Dialog.Header class="flex flex-col justify-start items-start space-y-4">
			<Dialog.Title>Feedback</Dialog.Title>
			<p class="text-sm text-gray-500">
				We'd love to hear your feedback! Please let us know what you think about UWA x Quizzes. If
				there's anything you'd like to see, please let us know!
			</p>
			<Textarea rows={6} bind:value={feedback} placeholder="Type your answer here." />
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={handleFeedbackSubmit} disabled={loading}>
				{#if loading}
					<Reload class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
