import { OPENAI_KEY } from "$env/static/private";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: OPENAI_KEY,
});



/**
 * Marks a student's submission for a question, given the question, the model answer and the student's submission.
 * @param {string} question
 * @param {string} model_answer
 * @param {string} student_attempt
 */
export async function mark_submission(question, model_answer, student_attempt) {
    const functions = [
        {
            "name": "mark_submission",
            "description": "Marks a student's attempt for a question, given the question, the model answer and the student's submission. \
            The feedback is written in second person, addressed to the student.",
            "parameters": {
                "type": "object",
                "properties": {
                    "quality": {
                        "type": "string",
                        "enum": ["correct", "minor inaccuracy", "incorrect"],
                        "description": "This indicates the accuracy of the student's attempt. 'correct' suggests the answer aligns well with the expected response. 'minor inaccuracy' means the student's answer was generally correct but missed some minor points. 'incorrect' indicates that the answer was largely or wholly wrong."
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "A detailed analysis of the the attmempt, comparing it with the model answer. \
                        This section highlights the strengths or weaknesses of the student's attempt, illustrating where they met the criteria or where they diverged. \
                        The reasoning should be concise, with a maximum of three sentences. The tone is objective and informative. \
                        It is written in second person, addressed to the student. \
                        Example: 'You correctly identified the main theme of the passage, but missed out on the supporting details.'"
                    },
                    "tip_for_improvement": {
                        "type": "string",
                        "description": "A constructive suggestion designed to help the student better understand the material or refine their approach to such questions. \
                        This feedback is intended to be positive, actionable, and forward-thinking, with a tone that is encouraging and supportive. \
                        It is 1-2 sentences long. \
                        Example: 'Next time, try reading the passage twice to catch all the nuanced details. You're on the right track!'"
                    },
                },
                "required": ["quality", "reasoning", "tip_for_improvement"]
            }
        }
    ]
    const prompt = `You are a teaching assistant bot that marks student attempt for a question. \
    The question is: "${question}". \
    The model answer is: "${model_answer}". \
    The student's attempt is: "${student_attempt}".`

    const messages = [{ "role": "user", "content": prompt }];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        functions: functions,
        function_call: {
            "name": "mark_submission",
        }
    })

    return response;
}