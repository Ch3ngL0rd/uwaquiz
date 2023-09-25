<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Alert from '$lib/components/ui/alert';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { userAnswerStore } from '$lib/userAnswerStore.js';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { onMount } from 'svelte';

	export let data;

	/**
	 * @type {any}
	 */
	let question_data = data.question;

	/**
	 * @type {any | undefined}
	 */
	let question = question_data?.data;

	/**
	 * @type {any}
	 */
	let selectedAnswer;

	let showHint = false;

	const handleShowHint = () => {
		showHint = true;
	};

	/*
	 * @type {string}
	 */
	let userAnswer = '';

	onMount(() => {
		userAnswerStore.set('');
	});

	const handleSubmit = () => {
		if (!selectedAnswer && userAnswer.length === 0) return;
		if (question.type === 'multiple_choice') {
			userAnswerStore.set(selectedAnswer);
		} else {
			userAnswerStore.set(userAnswer);
		}
		goto(`/quiz/${$page.params.quiz_id}/${$page.params.order}/answer`);
	};
</script>

<Dialog.Root open={showHint} onOpenChange={(e) => (showHint = e.detail)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Hint</Dialog.Title>
		</Dialog.Header>
        <Dialog.Description>
            {question.hint}
        </Dialog.Description>
		<Dialog.Footer>
			<Button variant="link" on:click={() => (showHint = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<main
	class="w-full h-full flex flex-col items-center justify-start space-y-5 bg-white px-5"
>
	{#if question}
		<div class="flex flex-row items-end justify-between space-x-4 w-full">
			<div>
				<Label for="question">Question</Label>
				<h4 class="font-medium">{question.question}</h4>
			</div>
			<Button class="shadow-lg" on:click={handleShowHint}>Hint</Button>
		</div>
		{#if question.type === 'multiple_choice'}
			<div class="flex flex-col space-y-4 w-full">
				{#each question.choices as choice, index}
					<label
						class={`flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-5 shadow cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out 
                        ${
													selectedAnswer === choice
														? 'border-blue-500 bg-blue-50'
														: 'border-gray-300'
												}
                    `}
					>
						<input
							type="radio"
							name="answer"
							id={`answer-${index}`}
							bind:group={selectedAnswer}
							value={choice}
							class="hidden"
						/>
						<Checkbox checked={selectedAnswer === choice} />
						<span>{choice}</span>
					</label>
				{/each}
			</div>
		{:else if question.type === 'understanding'}
			<div class="grid w-full gap-2">
				<Label for="userAnswer">Your Answer</Label>
				<Textarea
					rows={6}
					placeholder="Type your answer here."
					id="userAnswer"
					bind:value={userAnswer}
				/>
			</div>
		{/if}

		<div class="flex flex-row items-center justify-end w-full">
			<Button on:click={handleSubmit}>Submit</Button>
		</div>
	{:else}
		<div class="flex flex-row items-start justify-between space-x-4 w-full">
			<Skeleton class="h-4 w-1/2" />
		</div>
		<Skeleton class="h-1/2 w-full" />
	{/if}
</main>
