<script>
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { onMount } from 'svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	/**
	 * Json:
	 * [
	 * 	{
	 * "dialogue": [string],
	 * "reasoning": string,
	 * }
	 * ]
	 */
	const data = {
		setting:
			'A bustling university campus café. Students are scattered everywhere with books, laptops, and coffee cups. You, the founder of a startup, sit down with Alex, a third-year student majoring in History.',
		dialogue: [
			{
				speaker: 'You',
				text: "Hey Alex, thanks for meeting up. I've been trying to understand how students study from their lectures. When you have a big exam coming up, how do you usually prepare?"
			},
			{
				speaker: 'Alex',
				text: "Oh, usually, I reread my lecture notes a few times, and sometimes I make flashcards for the key concepts. But it's a lot of work."
			},
			{
				speaker: 'You',
				text: "Sounds time-consuming. How do you decide what's crucial to put on the flashcards?"
			},
			{
				speaker: 'Alex',
				text: "I guess I focus on the things I don't remember or understand well. But sometimes, I feel like I'm missing out on important details."
			}
		],
		choices: [
			{
				option: 'A',
				text: 'Tell Alex about your app idea immediately.',
				follow_up: {
					speaker: 'You',
					text: "That's interesting. I've been working on this app idea. It would turn your lecture notes into quizzes and interactive exercises. Think it might help?"
				},
				reasoning:
					"Jumping to your solution too quickly can lead to shallow feedback. You miss the chance to learn more about Alex's actual challenges and needs."
			},
			{
				option: 'B',
				text: "Dig deeper into Alex's study habits.",
				follow_up: {
					speaker: 'You',
					text: "I can imagine that's a bit stressful. When you say you might be missing out on details, can you remember a specific time when that happened?"
				},
				reasoning:
					"Asking about Alex's experiences before sharing your idea helps you understand real problems. This gives better feedback and can refine your solution."
			}
		]
	};

	let conversation = []
	let current_index = 0
</script>

<div class="flex flex-col justify-start items-center min-h-screen w-screen p-5 pb-20">
	<main class="flex flex-col justify-start items-start space-y-5 max-w-4xl w-full h-full">
		<header class="flex items-start justify-start w-full gap-4">
			<h3>UWA x Quizzes</h3>
			<Button variant="link" href={'/'}>Home</Button>
		</header>
		<section class="w-full flex flex-col items-start justify-start space-y-5">
			<h3 class="font-semibold">The Mom Test</h3>
			<blockquote class="border-l-2 pl-6 w-full">
				{data.setting}
			</blockquote>
			{#each data.dialogue as item,index}
				<div class="flex flex-col">
					<Label>
						<strong>{item.speaker}</strong>
					</Label>
					<p>{item.text}</p>
				</div>
			{/each}
		</section>
	</main>
</div>
