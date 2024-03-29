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
						// sort folders by alphabetical order - folder.name
						folders.sort((a, b) => a.name.localeCompare(b.name));
						quizFolders = folders;
					}
				});
		};

		fetchFolders();
	});
</script>

<Feedback {supabase} bind:show={showFeedback} on:openChange={(e) => (showFeedback = e.detail)} />
<main class="flex flex-col justify-start items-start min-h-screen w-screen p-5 space-y-5">
	<header class="flex items-start justify-between w-full gap-4">
		<h3>UWA x Quizzes</h3>
		<Button on:click={() => (showFeedback = true)} class="bg-blue-500 hover:bg-blue-600"
			>Request a Quiz</Button
		>
	</header>
	<Alert.Root>
		<Alert.Title class="text-2xl">Welcome!</Alert.Title>
		<Alert.Description class="text-sm">
			We're currently making quizzes for <u>Systems Programming</u> (CITS2002),
			<u>Risk Management and Financial Instruments</u>
			(FIFA5520) & <u>Integrated Medical Systems 2</u> (IMED3112).
			<br />
			If you'd like quizzes on a specific unit, click <b>Request a Quiz</b> - don't forget to include
			your contact details we can get in touch!
		</Alert.Description>
	</Alert.Root>
	<h3 class="font-semibold">Demos</h3>
	<section class="w-full flex flex-row space-x-2 items-center justify-start">
		<Button data-sveltekit-reload href="/quiz/22/1/question">Demo Quiz</Button>
	</section>
	<h3 class="font-semibold">Quizzes</h3>
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
					<Card.Title class="text-xl font-semibold tracking-tight">{@html folder.name}</Card.Title>
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
