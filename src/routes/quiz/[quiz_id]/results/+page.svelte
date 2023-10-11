<!-- You have 45 minutes
1. Get all questions
2. Get all responses -->

<script>
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Alert from '$lib/components/ui/alert';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Label } from '$lib/components/ui/label';
	import { Progress } from '$lib/components/ui/progress';

	const attempts = $page.data.props.attempts;
	const questions = $page.data.props.questions;

	// attempts.feedback.quality
	// correct = 1, minor inaccuracy = 0.5, mistake = 0
	// sum to get mark
	// For each question, add
	const mark = attempts.reduce((acc, attempt) => {
		const question = questions.find((q) => q.id === attempt.question_id);
		const quality = attempt.feedback.quality;
		const mark = quality === 'correct' ? 1 : quality === 'minor' ? 0.5 : 0;
		return acc + mark;
	}, 0);

	const combined = attempts.map((attempt) => {
		const question = questions.find((q) => q.question_id === attempt.question_id);
		return {
			attempt,
			question
		};
	});
	console.log(combined);

	const total = questions.length;

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
</script>

<main class="flex flex-col justify-center items-center h-full w-full space-y-5">
	<!-- Score -->
	<section class="py-5">
		<h2>You scored {mark} out of {total}</h2>
	</section>
	<section class="w-full flex flex-col space-y-5">
		<h3>Summary</h3>
		{#each combined as combine}
			<section
				class="flex flex-col bg-white shadow rounded-md p-5 space-y-5 border border-gray-300"
			>
				<div class="flex flex-col w-full gap-2">
					<Label for="question">Question</Label>
					<h4 class="font-medium" id="question">{combine.question.data.question}</h4>
				</div>
				{#if combine.question.data.type === 'multiple_choice'}
					<div class="flex flex-col space-y-4 w-full">
						{#each combine.question.data.choices as choice, index}
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label
								class={`flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-5 shadow cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out 
					${combine.attempt.answer === choice && choice === combine.question.data.answer ? 'bg-green-200' : ''} 
					${combine.attempt.answer === choice && choice !== combine.question.data.answer ? 'bg-red-200' : ''}
					${choice === combine.question.data.answer ? 'bg-green-200' : ''} border-gray-300
				`}
							>
								<Checkbox checked={combine.attempt.answer === choice} disabled={true} />
								<span>{choice}</span>
							</label>
						{/each}
					</div>
					<Alert.Root class="w-full border p-5 shadow border-blue-500 bg-blue-50">
						<Alert.Title>Justification</Alert.Title>
						<Alert.Description>{combine.question.data.justification}</Alert.Description>
					</Alert.Root>
				{:else if combine.question.data.type === 'understanding'}
					<div
						class={`flex flex-col space-y-4 border p-5 shadow rounded-sm w-full
		${
			combine.attempt.feedback.quality === 'correct'
				? 'border-green-500 bg-green-50'
				: combine.attempt.feedback.quality === 'minor inaccuracy'
				? 'border-yellow-500 bg-yellow-50'
				: 'border-red-500 bg-red-50'
		}
	`}
					>
						<Label for="answer">{capitalizeFirstLetter(combine.attempt.feedback.quality)}</Label>
						<div>
							<p id="answer">{combine.attempt.feedback.reasoning}</p>
						</div>
						<div>
							<Label for="answer">Tip for Improvement</Label>
							<p id="answer">{combine.attempt.feedback.tip_for_improvement}</p>
						</div>
					</div>
					<div
						class="flex flex-col space-y-4 w-full border p-5 shadow border-blue-500 bg-blue-50 rounded-sm"
					>
						<div>
							<Label for="answer">Model Answer</Label>
							<p id="answer">{combine.question.data.answer}</p>
						</div>
						<div>
							<Label for="answer">Your Answer</Label>
							<p id="answer">{combine.attempt.answer}</p>
						</div>
					</div>
				{/if}
			</section>
		{/each}
	</section>
	<Button href="/">Back to Home</Button>
</main>
