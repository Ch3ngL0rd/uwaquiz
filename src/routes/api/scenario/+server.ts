import { create_scenario } from '$lib/server/momtest';
import { error, json } from '@sveltejs/kit';
// src/routes/echo.js

export async function POST({ request, locals: { supabase, getSession } }) {
    const session = await getSession();
    const { startup_idea } = await request.json();

    if (!session) {
        throw error(401, { message: 'Unauthorized' })
    }

    const user_id = session.user.id;

    if (!startup_idea) {
        throw error(400, { message: 'Quiz id not provided' })
    }

    const response = await create_scenario(startup_idea);
    try {
        const data = JSON.parse(response.choices[0].message.function_call.arguments);
        return json(data)
    }
    catch (error_message) {
        console.log(error_message)
        console.log(response)
        throw error(500, { message: 'Something went wrong' })
    }

}
