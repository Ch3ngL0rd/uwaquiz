import { mark_submission } from '$lib/server/mark';
import { error, json } from '@sveltejs/kit';
// src/routes/echo.js

export async function POST({ request, locals: { supabase, getSession } }) {
    const session = await getSession();
    const { quality, attempt, question_id, quiz_id } = await request.json();
    console.log(`quality: ${quality}, attempt: ${attempt} question_id: ${question_id}, quiz_id: ${quiz_id}`)    
    // I think you should pass in justifications as well
    if (!session) {
        throw error(401, { message: 'Unauthorized' })
    }

    if (!quality || !attempt || !question_id) {
        console.log(`quality: ${quality}, attempt: ${attempt} question_id: ${question_id}`)
        throw error(400, { message: 'Missing question, model_answer or attempt' })
    }

    try {
        const { data, error } = await supabase.from('attempts').insert({
            question_id: question_id,
            user_id: session.user.id,
            feedback: {
                quality
            },
            answer: attempt,
            quiz_id: quiz_id
        })
        if (error) {
            console.log(error)
            throw error(500, { message: 'Something went wrong' })
        }
        return json(data)
    } catch (error_message) {
        console.log(error_message)
        throw error(500, { message: 'Something went wrong' })
    }
}
