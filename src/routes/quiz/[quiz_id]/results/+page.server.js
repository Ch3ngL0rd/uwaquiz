//@ts-ignore
// src/routes/quizzes/[quiz_id]/+layout.server.js
export async function load({ params, locals }) {
	const { supabase, getSession } = locals;

	const session = await getSession();

	if (!session || !session.user) {
		return {
			status: 403,
			error: "You must be logged in to view this page."
		};
	}

	const quiz_id = params.quiz_id;
	const user_id = session.user.id;

	const { data, error } = await supabase.from("latest_attempts").select("*").eq("quiz_id", quiz_id).eq("user_id", user_id);

	// gets questions from quiz as well
	const { data: questions, error: questionsError } = await supabase.from("questions").select("*").eq("quiz_id", quiz_id);

	if (error) {
		return {
			status: 500,
			error: error.message
		};
	}
	if (questionsError) {
		return {
			status: 500,
			error: questionsError.message
		};
	}

	return {
		props: {
			quiz_id,
			attempts: data,
			questions: questions
		}
	};
}