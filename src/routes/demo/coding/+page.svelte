<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/vs.css'; // choose your desired style
	import { onMount } from 'svelte';

	const highlight = (code: string) => {
		return hljs.highlight(code, { language: 'python' }).value;
	};

	const old_solution = highlight(`
def twoSum(nums, target):
    # Create a dictionary to store the numbers we've seen so far and their indices.
    seen = {}
    # Iterate over each number in the list.
    for i, num in enumerate(nums):
        # Calculate the complement of the current number.
        complement = target - num
        # Check if the complement is in our dictionary.
        if complement in seen:
            # If it is, return the indices of the complement and the current number.
            return [seen[complement], i]
        # Otherwise, add the current number and its index to the dictionary.
        seen[num] = i`);

	// Collection of thoughts and code. Each line of code has a corresponding line in the final solution.
	// Each line can add to the solution, change a line, or remove a line.
	// When we hover over a thought or code, we can see the line it corresponds to in the final solution.
	// A thought can stand on its own, or be associated with a line of code.
	// A line of code can never stand on its own. It must be associated with a thought.

	const thoughts = [
		{
			text: 'Alright, I need to find two numbers in a list that, when added together, equal a given target.',
			code: '',
            final_solution: ''
		},
		{
			text: 'I should start by defining a function to keep things organized. This function will take in the list of numbers and the target number.',
			code: 'def twoSum(nums, target):',
            final_solution: 'def twoSum(nums, target):'
		},
		{
			text: 'One basic way is to take a number and then look for its partner by checking it with every other number. This means using two loops.',
			code: 'for i in range(len(nums)):\n    for j in range(i+1, len(nums)):',
            final_solution: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n'
		},
		{
			text: "Inside the loops, I'll add the numbers together. If their sum equals the target, I've found the pair!",
			code: 'if nums[i] + nums[j] == target:',
            final_solution: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n'
		},
		{
			text: "But looping like this means I'll be checking lots of pairs. It sounds slow for a big list. That's an O(N^2) approach.",
			code: '',
            final_solution: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n'
		},
		{
			text: "There has to be a faster way. I'm realizing that for any number, its partner (the one that makes them add up to the target) is just the target minus the number I'm looking at.",
			code: '',
            final_solution: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n'
		},
		{
			text: "Instead of using a second loop to find that partner, maybe I can keep a memory of numbers I've already seen? A dictionary could be perfect for this.",
			code: 'seen = {}',
            final_solution: 'def twoSum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n'
		},
		{
			text: "As I go through the list, for each number, I'll calculate what its partner should be. Then, I'll see if that partner is in my memory (the dictionary).",
			code: 'complement = target - num\nif complement in seen:',
            final_solution: 'def twoSum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        complement = target - num\n        if complement in seen:\n'
		},
		{
			text: "If I find the partner in the dictionary, that means I've seen it earlier in the list! So I can return both of their positions.",
			code: 'return [seen[complement], i]',
            final_solution: 'def twoSum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n'
		},
		{
			text: "If the partner isn't in the dictionary, I'll remember the current number by adding it to the dictionary.",
			code: 'seen[num] = i',
            final_solution: 'def twoSum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n'
		},
		{
			text: "With this approach, I'm only looping through the list once, making it O(N). That's way faster than O(N^2)!",
			code: '',
            final_solution: 'def twoSum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n'
		}
	];
	let current_thought = 0;
</script>

<div class="flex flex-col justify-center items-center min-h-screen w-screen p-5 pb-20">
	<main class="flex flex-col justify-center items-center space-y-20 max-w-5xl">
		<header class="flex items-start justify-start w-full gap-4">
			<h3>UWA x Quizzes</h3>
			<Button variant="link" href={'/'}>Home</Button>
		</header>
		<section class="w-full flex flex-col items-center justify-start space-y-5">
			<h4 class="font-medium">Introduction</h4>
			<div class="mt-6 border-l-2 pl-6 w-full">
				<strong>Coding is more than just the final solution.</strong> Understanding the process
				matters. With tools like Large Language Models, we can show that process. Instead of just
				presenting the answer, we can show how we got there.
				<br /> I've tutored students who didn't understand a problem. They didn't even understand
				the solution when I showed them. But after seeing the solution and its process, they
				understood. I had to explain <em>why</em>
				I did what I did. I saw it 'click' in their eyes. <strong>They understood</strong>.
			</div>
			<div class="mt-6 border-l-2 pl-6 w-full">
				Let's dive into a classic coding challenge. Most solutions out there present a
				straightforward answer, often missing the heart of the journey. But what if we took a
				different approach? What if, instead of just a solution, we narrated the story of arriving
				at that solution? Let's explore this together—first, by looking at the conventional way it's
				addressed, and then by unveiling a more insightful, process-driven approach.
			</div>

			<h5>The Two Sum Problem</h5>
			<code class="w-full p-5 bg-gray-100 rounded-lg">
				Given an array of integers `nums` and an integer `target`, return the indices of the two
				numbers such that they add up to `target`.
				<br />
				Example: <br />
				Input: nums = [2,7,11,15], target = 9 <br />
				Output: [0,1] <br />
				Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]. <br />
			</code>
		</section>
		<section class="w-full flex flex-col items-center justify-start space-y-5">
			<h4 class="font-medium">Old Solution</h4>
			<pre class="w-full px-5 bg-gray-100 rounded-lg">
            {@html old_solution}
        </pre>
			<code class="w-full p-5 bg-gray-100 rounded-lg">
				Explanation:
				<br />
				We go through the list just once. As we look at each number, we check if its complement (the
				number needed to reach the target) is in our dictionary. If it's there, we've found our pair
				and we return their indices. If not, we add the current number and its index to the dictionary
				and move on.
			</code>

			<div class="mt-6 border-l-2 pl-6 w-full">
				Just seeing an answer doesn't always help, right? To really get a coding problem, you need
				to feel what the coder felt. It's like riding a bike. You won't get it until you try it
				yourself.
				<br /><br />
				That's why showing the thought process is so important. It's the journey to the answer that matters.
				Let's dive into that journey and see how it can help us understand better.
			</div>
		</section>
		<h4 class="font-medium">New Solution</h4>
        <h5>Work in Progress...</h5>
		<!-- <div class="w-full flex flex-row items-start justify-start">
			<div class="w-1/2 flex flex-col items-center justify-start">
				{#each [thoughts[current_thought]] as thought, index}
					<div class="flex flex-row items-start justify-start space-x-4 w-full h-full">
						<div class="flex flex-col space-y-2 w-full">
							{#if thought.text}
								<p class="font-medium">{thought.text}</p>
							{/if}
							{#if thought.code}
								<pre class="w-full p-5 bg-gray-100 rounded-lg">{@html highlight(thought.code)}</pre>
							{/if}
						</div>
					</div>
				{/each}
			</div>
			<div class="w-1/2 flex flex-col items-center justify-start h-full">
				<pre class="w-full p-5 bg-gray-100 rounded-lg">{@html highlight(
						thoughts[current_thought]['final_solution']
					)}</pre>
			</div>
		</div>
        <div class="flex flex-row items-center justify-between w-full">
            <div class="flex flex-row items-center justify-start space-x-4">
                <Button variant="outline" on:click={() => (current_thought -= 1)}>Previous</Button>
                <Button variant="outline" on:click={() => (current_thought += 1)}>Next</Button>
            </div>
            <div class="flex flex-row items-center justify-end space-x-4">
                <Button variant="outline" on:click={() => (current_thought = 0)}>Reset</Button>
                <Button variant="outline" on:click={() => (current_thought = thoughts.length - 1)}>Skip</Button>
            </div>
        </div> -->
	</main>
</div>
