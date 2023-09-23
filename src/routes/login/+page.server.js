// @ts-nocheck
// src/routes/login/+page.server.js
import { fail } from '@sveltejs/kit'

export const actions = {
    default: async ({ request, url, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email')

        const password = "GOOFY_AHHH_VERY_SECURE_PASSWORD"

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        console.log(error)

        let signInError = null;

        // if user is already signed up, we'll get an error
        if (error.message === "User already registered") {
            // so we'll try to sign in instead
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            console.log(signInError)

            if (signInError) {
                // if there's an error signing in, we'll return that
                return {
                    status: 500,
                    body: {
                        error: error.message,
                        signInError: signInError.message,
                    },
                }
            }
        }

        if (signInError) {
            // Status code fail is 500
            return {
                status: 500,
                body: {
                    error: error.message,
                    signInError: signInError.message,
                },
            }
        }

        console.log("User signed up or signed in")

        // Success
        return {
            status: 303,
            headers: {
                location: '/',
            },
        }
    },
}