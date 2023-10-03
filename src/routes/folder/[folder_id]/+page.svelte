<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Rocket } from 'radix-icons-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Table from '$lib/components/ui/table';

	import { Skeleton } from '$lib/components/ui/skeleton';
	import { page } from '$app/stores';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	interface Quiz {
		quiz_id: number;
		title: string;
		created_at: string;
		folder_id: number;
		question_count: number;
	}

	interface QuizFolder {
		folder_id: number;
		name: string;
		description: string;
	}

	let quizzes: Quiz[] = [];

	const folder_id = parseInt($page.params.folder_id);

	let folder: QuizFolder | undefined | null = undefined;

	onMount(async () => {
		const fetchQuizzes = async () => {
			supabase
				.from('quiz_question_count')
				.select('*')
				.order('created_at', { ascending: true })
				.eq('folder_id', folder_id)
				.then(({ data, error }) => {
					if (error) {
						console.log(error);
					} else {
						quizzes = data;
					}
				});
		};

		const fetchDone = async () => {
			console.log(session?.user.id);
			
			let { data, error } = await supabase.rpc('get_attempted_quizzes', {
				folder_id,
				user_id : session?.user.id
			});
			console.log(data, error);
		};

		const fetchFolder = async (folder_id: number) => {
			supabase
				.from('folders')
				.select('*')
				.eq('folder_id', folder_id)
				.single()
				.then(({ data, error }) => {
					if (error) {
						console.log(error);
					} else {
						folder = data;
					}
				});
		};

		fetchFolder(folder_id);
		fetchQuizzes();
		fetchDone();
	});

	function timeSince(date: Date) {
		const now = new Date();
		const secondsPast = (now.getTime() - date.getTime()) / 1000;

		if (secondsPast < 60) {
			return 'Just now';
		}
		if (secondsPast < 3600) {
			if (Math.round(secondsPast / 60) === 1) {
				return `${Math.round(secondsPast / 60)} minute ago`;
			}
			return `${Math.round(secondsPast / 60)} minutes ago`;
		}
		if (secondsPast <= 86400) {
			return 'Today';
		}
		if (secondsPast <= 172800) {
			return 'Yesterday';
		}

		const daysPast = Math.round(secondsPast / 86400);
		return `${daysPast} days ago`;
	}
</script>

<main class="flex flex-col justify-start items-start min-h-full w-full p-5 space-y-5">
	<header class="flex items-start justify-start w-full gap-4 border-b pb-5">
		<h3>UWA x Quizzes</h3>
		<Button variant="link" href={'/'}>Home</Button>
	</header>

	<!-- TABLE OF QUIZZES -->
	<section class="w-full flex flex-col space-y-2">
		{#if folder}
			<h3>{@html folder.name}</h3>
			<p>{folder.description}</p>
		{:else}
			<Skeleton class="w-full h-16" />
		{/if}
	</section>
	<Table.Root class="w-full">
		<Table.Caption>Quizzes</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-1/3">Quiz</Table.Head>
				<Table.Head class="w-1/3">Info</Table.Head>
				<Table.Head class="w-1/3">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each quizzes as quiz}
				<Table.Row>
					<Table.Cell class="font-semibold">{quiz.title}</Table.Cell>
					<Table.Cell>{quiz.question_count} questions</Table.Cell>
					<Table.Cell>
						<Button href={`/quiz/${quiz.quiz_id}/1/question`}>Recap</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</main>
