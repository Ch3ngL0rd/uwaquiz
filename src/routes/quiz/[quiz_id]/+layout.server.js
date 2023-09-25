//@ts-ignore
// src/routes/quizzes/[quiz_id]/+layout.server.js
export async function load({ params, locals }) {
    const { supabase } = locals;
    const quiz_id = params.quiz_id;

    const { data, error } = await supabase.from('quiz_question_count').select('*').eq('quiz_id', quiz_id);

    console.log("data", data);
    console.log("error", error);

    if (error) {
        console.error("Failed to fetch quiz:", error);
        return {
            status: 500,
            quiz: null,
            error: "Failed to fetch quiz."
        };
    }

    if (!data || data.length === 0) {
        return {
            status: 404,
            quiz: null,
            error: "Quiz not found."
        };
    }

    return {
        status: 404,
        quiz: data[0]
    };
}