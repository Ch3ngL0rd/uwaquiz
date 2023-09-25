<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';

	/**
	 * @type {string}
	 */
	let title = '';
	$: if ($page.data.quiz) {
		({ title } = $page.data.quiz);
	}

	$: order = parseInt($page.params.order);

	$: if (order > $page.data.quiz.question_count) {
		// if it is, go to the results page
		goto(`/quiz/${$page.params.quiz_id}/results`);
	}
</script>

<main class="flex flex-col justify-start items-start min-h-screen w-screen space-y-5">
	<header class="flex items-start justify-start w-full gap-4 border-b p-5">
		<h3>UWA x Quizzes</h3>
		<Button variant="link" href={'/'}>Home</Button>
	</header>
	{#if parseInt($page.params.order) <= $page.data.quiz.question_count}
		<section class="px-10 pb-5 border-b w-full flex flex-row items-center justify-between">
			<h5 class="font-medium">{title}</h5>
			<h5>Question {$page.params.order}/{$page.data.quiz.question_count}</h5>
		</section>
		{:else}
		<section class="px-5 pb-5 border-b w-full flex flex-row items-center justify-between">
			<h5 class="font-medium">{title}</h5>
		</section>
	{/if}
	<section class="w-full px-5 pb-5">
		<slot />
	</section>
</main>
