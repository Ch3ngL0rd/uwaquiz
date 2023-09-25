import { create_summary, extract_concept_mastery } from '$lib/server/summary';
import { error, json } from '@sveltejs/kit';
// src/routes/echo.js

export async function POST({ request, locals: { supabase, getSession } }) {
    const session = await getSession();
    const { quiz_id } = await request.json();

    // I think you should pass in justifications as well
    if (!session) {
        throw error(401, { message: 'Unauthorized' })
    }

    const user_id = session.user.id;

    if (!quiz_id) {
        throw error(400, { message: 'Quiz id not provided' })
    }

    let { data: summaryData, error: summaryError } = await supabase
        .from('summaries')
        .select('*')
        .eq('quiz_id', quiz_id)
        .eq('user_id', user_id)

    if (summaryError) {
        throw error(500, { message: 'Something went wrong' })
    }

    if (summaryData.length > 0) {
        return json({ summary: summaryData[0].summary, concepts: summaryData[0].concepts });
    }

    let { data, error: questionError } = await supabase
        .from('latest_attempts')
        .select('*, questions (*)')
        .eq('quiz_id', quiz_id)
        .eq('user_id', user_id)

    if (questionError) {
        throw error(500, { message: 'Something went wrong' })
    }

    try {
        // Initiate both functions concurrently
        const [summaryResponse, conceptsResponse] = await Promise.all([
            create_summary(data),
            extract_concept_mastery(data)
        ]);

        let summary, concepts;

        if (summaryResponse.choices[0].message.function_call) {
            // Parse the arguments as json
            let function_arguments = summaryResponse.choices[0].message.function_call.arguments;
            // First removes all new lines
            function_arguments = function_arguments.replace(/(\r\n|\n|\r)/gm, "");
            // checks for `",}` and replaces it with `"}` since the json parser doesn't like it
            function_arguments = function_arguments.replace(/",}/gm, '"}');
            summary = JSON.parse(function_arguments)
        }

        if (conceptsResponse.choices[0].message.function_call) {
            // Escapes double quotes
            let function_arguments = conceptsResponse.choices[0].message.function_call.arguments;
            // First removes all new lines
            function_arguments = function_arguments.replace(/(\r\n|\n|\r)/gm, "");
            // checks for `",}` and replaces it with `"}` since the json parser doesn't like it
            function_arguments = function_arguments.replace(/",}/gm, '"}');
            concepts = JSON.parse(function_arguments)
        }

        // insert into summaries table
        let { data: insertData, error: insertError } = await supabase
            .from('summaries')
            .insert([
                { user_id, quiz_id, summary, concepts }
            ])

        return json({ summary, concepts });
    } catch (error_message) {
        console.log(error_message);
        throw error(500, { message: 'Something went wrong' });
    }

}
