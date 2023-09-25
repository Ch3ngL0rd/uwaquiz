//@ts-ignore
// src/routes/quizzes/[quiz_id]/+layout.server.js
export async function load({ params, locals }) {
	const { supabase } = locals;
	const quiz_id = params.quiz_id;
	const order = params.order;

	const { data, error } = await supabase
		.from('questions')
		.select('*')
		.eq('quiz_id', quiz_id)
		.eq('global_order', order)
		.eq('type','recap')
		.single();

	if (error) {
		console.error("Failed to fetch question:", error);
		return {
			status: 500,
			question: null,
			error: "Failed to fetch question."
		};
	}

	if (!data) {
		return {
			status: 404,
			question: null,
			error: "Question not found."
		};
	}

	return {
		status: 200,
		question: data
	};

}