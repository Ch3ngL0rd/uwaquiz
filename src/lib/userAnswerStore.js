import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const userAnswerStore = writable(
	(browser && JSON.parse(localStorage.getItem('userAnswerStore') || '""')) || ''
);

userAnswerStore.subscribe((value) => {
	if (browser) localStorage.setItem('userAnswerStore', JSON.stringify(value));
});
