<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Rocket } from 'radix-icons-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Feedback from '$lib/components/Feedback.svelte';

	export let data;
	
	interface QuizFolder {
		folder_id: number;
		name: string;
		description: string;
	}

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let quizFolders: QuizFolder[] = [];

	let showFeedback = false;

	onMount(async () => {
		const fetchFolders = async () => {
			supabase
				.from('folders')
				.select('*')
				.then(({ data: folders, error }) => {
					if (error) {
						console.log(error);
					} else {
						quizFolders = folders;
					}
				});
		};

		fetchFolders();
	});
</script>

<Feedback {supabase} bind:show={showFeedback} on:openChange={(e) => (showFeedback = e.detail)} />
<main
	class="flex flex-col justify-start items-start min-h-screen w-screen bg-gray-100 p-5 space-y-5"
>
	<header class="flex items-start justify-start w-full gap-4">
		<h3>UWA x Quizzes</h3>
		<Button variant="link" on:click={() => (showFeedback = true)}>Give Feedback</Button>
	</header>
	<Alert.Root>
		<Rocket class="h-4 w-4" />
		<Alert.Title>Welcome!</Alert.Title>
		<Alert.Description>
			Explore some quizzes created by other students at UWA to revise for your exams! If you'd like
			quizzes on a specific unit, email us at <Button
				variant="link"
				class="font-bold p-0 m-0 h-min"
				href="mailto:help@uwaquiz.com">help@uwaquiz.com</Button
			> and we'll see what we can do!
		</Alert.Description>
	</Alert.Root>
	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
		{#if quizFolders.length === 0}
			<Skeleton class="w-full max-w-sm h-48" />
			<Skeleton class="w-full max-w-sm h-48" />
			<Skeleton class="w-full max-w-sm h-48" />
		{/if}
		{#each quizFolders as folder}
			<Card.Root
				class="p-2 max-w-sm w-full
                 flex flex-col justify-between shadow-sm hover:shadow-lg transition duration-300 ease-in-out hover:scale-[1.01]"
			>
				<Card.Header>
					<Card.Title class="text-xl font-semibold tracking-tight">{folder.name}</Card.Title>
					<Card.Description>{folder.description}</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button
						data-sveltekit-reload
						variant="outline"
						class="w-full"
						href={`/folder/${folder.folder_id}`}
					>
						Open
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</section>
</main>
