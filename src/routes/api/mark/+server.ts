import { mark_submission } from '$lib/server/mark';
import { error, json } from '@sveltejs/kit';
// src/routes/echo.js

export async function POST({ request, locals: { supabase, getSession } }) {
    const session = await getSession();
    const { question, model_answer, attempt, question_id, quiz_id } = await request.json();

    // I think you should pass in justifications as well
    if (!session) {
        throw error(401, { message: 'Unauthorized' })
    }

    if (!question || !model_answer || !attempt || !question_id) {
        console.log(`question: ${question}, model_answer: ${model_answer}, attempt: ${attempt} question_id: ${question_id}`)
        throw error(400, { message: 'Missing question, model_answer or attempt' })
    }

    try {
        const response = await mark_submission(question, model_answer, attempt)
        if (response.choices[0].message.function_call) {
            // Parse the arguments as json
            const mark = JSON.parse(response.choices[0].message.function_call.arguments)
            // Stores in supabase
            const { data, error } = await supabase.from('attempts').insert({
                question_id: question_id,
                user_id: session.user.id,
                feedback: {
                    quality: mark.quality,
                    reasoning: mark.reasoning,
                    tip_for_improvement: mark.tip_for_improvement
                },
                answer: attempt,
                quiz_id: quiz_id
            })
            console.log(data)
            console.log(error)
            return json(mark)
        }
    } catch (error_message) {
        console.log(error_message)
        throw error(500, { message: 'Something went wrong' })
    }
}
