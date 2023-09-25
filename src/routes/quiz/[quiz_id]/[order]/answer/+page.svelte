<script>
	import { userAnswerStore } from '$lib/userAnswerStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Alert from '$lib/components/ui/alert';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Rocket } from 'radix-icons-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Progress } from '$lib/components/ui/progress';

	export let data;

	/**
	 * @type {string}
	 */
	let userAnswer;

	/**
	 * @type {any}
	 */
	let question_data = data.question;

	/**
	 * @type {any | undefined}
	 */
	let question = question_data?.data;

	let isLoading = true;

	/**
	 * @type { { quality: string, reasoning: string, tip_for_improvement: string } | undefined }
	 */
	let mark = undefined;

	userAnswerStore.subscribe((value) => {
		userAnswer = value;
	});

	const handleSubmit = () => {
		// as int
		let order = parseInt($page.params.order);
		goto(`/quiz/${$page.params.quiz_id}/${order + 1}/question`);
	};

	onMount(async () => {
		if (question.type === 'understanding') {
			// Sends a post request to our server to mark the question
			const response = await fetch('/api/mark', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question: question.question,
					model_answer: question.answer,
					attempt: userAnswer,
					question_id: question_data.question_id,
					quiz_id: question_data.quiz_id
				})
			});
			const data = await response.json();
			mark = data;
			if (data.quality === 'correct') {
				mark.quality = 'Correct';
			} else if (data.quality === 'minor inaccuracy') {
				mark.quality = 'Minor Inaccuracy';
			} else if (data.quality === 'incorrect') {
				mark.quality = 'Mistake';
			}
		} else if (question.type === 'multiple_choice') {
			let quality = userAnswer === question.answer ? 'correct' : 'incorrect';
			const response = await fetch('/api/mark-multiple', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					quality: quality,
					attempt: userAnswer,
					question_id: question_data.question_id,
					quiz_id: question_data.quiz_id
				})
			});
		}
		isLoading = false;
	});

	let randomProgress = 0;
	const targetValue = 100;
	const duration = 5000; // 5 seconds in milliseconds

	function updateProgress() {
		const currentTime = new Date().getTime();
		const endTime = currentTime + duration;

		function incrementProgress() {
			const now = new Date().getTime();
			if (now >= endTime) {
				randomProgress = targetValue;
				return;
			}

			const randomStep = Math.random() * (20 - 5) + 5; // Random value between 5 and 20
			randomProgress += randomStep;
			if (randomProgress > targetValue) {
				randomProgress = targetValue;
			}

			const randomInterval = Math.random() * (1200 - 400) + 400; // Random interval between 400ms to 1200ms

			setTimeout(incrementProgress, randomInterval);
		}

		incrementProgress();
	}

	// Call the function to start the progress
	updateProgress();
</script>

<!-- no x scroll -->
<main class="w-full h-full flex flex-col items-center justify-start space-y-5 px-5">
	{#if question || isLoading === false}
		<div class="flex flex-col w-full gap-2">
			<Label for="question">The Question</Label>
			<h4 class="font-medium" id="question">{question.question}</h4>
		</div>
		{#if question.type === 'multiple_choice'}
			<div class="flex flex-col space-y-4 w-full">
				{#each question.choices as choice, index}
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label
						class={`flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-5 shadow cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out 
                        ${
													userAnswer === choice && choice === question.answer ? 'bg-green-200' : ''
												} 
                        ${userAnswer === choice && choice !== question.answer ? 'bg-red-200' : ''}
                        ${choice === question.answer ? 'bg-green-200' : ''} border-gray-300
                    `}
					>
						<Checkbox checked={userAnswer === choice} disabled={true} />
						<span>{choice}</span>
					</label>
				{/each}
			</div>
			<Alert.Root class="w-full border p-5 shadow border-blue-500 bg-blue-50">
				<Alert.Title>Justification</Alert.Title>
				<Alert.Description>{question.justification}</Alert.Description>
			</Alert.Root>
		{:else if question.type === 'understanding'}
			{#if mark === undefined}
				<Skeleton class="h-32 w-full" />
				<div class="py-4 w-full">
					<Progress value={randomProgress} />
				</div>
			{:else}
				<!-- Colour of box - green if correct, yellow if minor inaccuracy, red if mistake -->
				<div
					class={`flex flex-col space-y-4 border p-5 shadow rounded-sm w-full
				${
					mark.quality === 'Correct'
						? 'border-green-500 bg-green-50'
						: mark.quality === 'Minor Inaccuracy'
						? 'border-yellow-500 bg-yellow-50'
						: 'border-red-500 bg-red-50'
				}
			`}
				>
				<Label for="answer">{mark.quality}</Label>
					<div class=" max-w-[90%]">
						<p id="answer">{mark.reasoning}</p>
					</div>
					<div class=" max-w-[90%]">
						<Label for="answer">Tip for Improvement</Label>
						<p id="answer">{mark.tip_for_improvement}</p>
					</div>
				</div>
				<!-- Card -->
				<div
					class="flex flex-col space-y-4 w-full border p-5 shadow border-blue-500 bg-blue-50 rounded-sm"
				>
					<div>
						<Label for="answer">Model Answer</Label>
						<p id="answer">{question.answer}</p>
					</div>
					<div>
						<Label for="answer">Your Answer</Label>
						<p id="answer">{userAnswer}</p>
					</div>
				</div>
			{/if}
		{/if}
		<div class="flex flex-row items-center justify-end w-full">
			<Button on:click={handleSubmit} disabled={isLoading}>Next</Button>
		</div>
	{:else}
		<div class="flex flex-row items-start justify-between space-x-4 w-full h-full">
			<Skeleton class="h-4 w-1/2" />
		</div>
		<Skeleton class="h-1/2 w-full" />
	{/if}
</main>
