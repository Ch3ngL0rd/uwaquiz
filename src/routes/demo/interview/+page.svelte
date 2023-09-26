<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { onMount } from 'svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';

	let scenario = '';
	let startup_idea = '';
	let loading_scenario = false;
	let dialogue = [];

	interface Choice {
		reasoning: string;
		dialogue: string;
		intention: string;
	}

	let correct_choice: Choice;
	let incorrect_choices: Choice;
	let show_choices = false;

	let showReasoning = false;
	let reasoning = '';

	const handleStartupIdea = async () => {
		loading_scenario = true;
		const response = await fetch('/api/scenario', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				startup_idea
			})
		});
		const data = await response.json();

		scenario = data.scenario;
		loading_scenario = false;
		generateDialogue();
	};

	const generateDialogue = async () => {
		show_choices = false;
		const response = await fetch('/api/dialogue', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				scenario,
				dialogue: dialogue,
				startup_idea
			})
		});
		const data = await response.json();
		dialogue = [...dialogue, ...data.dialogue];
		correct_choice = {
			reasoning: data.correct_choice_reasoning,
			dialogue: data.correct_dialogue,
			intention: data.correct_intention
		};
		incorrect_choices = {
			reasoning: data.incorrect_choice_reasoning,
			dialogue: data.incorrect_dialogue,
			intention: data.incorrect_intention
		};
		show_choices = true;
	};

	const handleCorrect = () => {
		dialogue = [...dialogue, ...[correct_choice.dialogue]];
		showReasoning = true;
		reasoning = correct_choice.reasoning;
		generateDialogue();
	};

	const handleIncorrect = () => {
		dialogue = [...dialogue, ...[incorrect_choices.dialogue]];
		showReasoning = true;
		reasoning = incorrect_choices.reasoning;
		generateDialogue();
	};
</script>

<Dialog.Root open={showReasoning} onOpenChange={(e) => (showReasoning = e.detail)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Reasoning</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			{reasoning}
		</Dialog.Description>
		<Dialog.Footer>
			<Button variant="link" on:click={() => (showReasoning = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="flex flex-col justify-start items-center min-h-screen w-screen p-5 pb-20">
	<main class="flex flex-col justify-start items-start space-y-5 max-w-4xl w-full h-full">
		<header class="flex items-start justify-start w-full gap-4">
			<h3>UWA x Quizzes</h3>
			<Button variant="link" href={'/'}>Home</Button>
		</header>
		<section class="w-full flex flex-col items-start justify-start space-y-5">
			<h3 class="font-semibold">The Mom Test</h3>
			<blockquote class="mt-6 border-l-2 pl-6 w-full">
				The "Mom Test" helps entrepreneurs get real feedback on their ideas. Instead of pitching a
				product, it's about understanding people's actual experiences. The main tips are: talk about
				the person's life, focus on what they've done in the past, and listen more than you speak.
				This way, you get honest insights without the fluff.
			</blockquote>
			<Button variant="outline" on:click={generateDialogue}>Retry</Button>
			{#if scenario === ''}
				<form on:submit={handleStartupIdea} class="w-full">
					<Input
						bind:value={startup_idea}
						placeholder="What's your startup idea?"
						disabled={loading_scenario}
					/>
				</form>
				{#if loading_scenario}
					<p>Loading...</p>
				{:else}
					<Button on:click={handleStartupIdea}>Generate Scenario</Button>
				{/if}
			{:else}
				<h5 class="font-semibold">Startup Idea</h5>
				<p>{startup_idea}</p>
				<h5 class="font-semibold">Scenario</h5>
				<p>{scenario}</p>
				<section class="flex flex-col items-start justify-start space-y-5">
					{#each dialogue as line}
						<!-- if line is in the form name: -->
						{#if line.includes(':')}
							<div>
								<Label class="font-semibold">{line.split(':')[0]}</Label>
								<p>{line.split(':')[1]}</p>
							</div>
						{:else}
							<p>{line}</p>
						{/if}
					{/each}
				</section>
				{#if show_choices}
					<section class="flex flex-row items-start justify-start space-x-5">
						<Button variant="outline" on:click={handleCorrect}>{correct_choice.intention}</Button>
						<Button variant="outline" on:click={handleIncorrect}
							>{incorrect_choices.intention}</Button
						>
					</section>
				{/if}
			{/if}
		</section>
	</main>
</div>
