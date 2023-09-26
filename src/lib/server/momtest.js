import { OPENAI_KEY } from "$env/static/private";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: OPENAI_KEY,
});

// Progress bar with specific concepts
export async function create_scenario(startup_idea) {
    const functions = [
        {
            "name": "create_scenario",
            "description": "Creates a scenario for a startup idea. It is suitable for a pitch deck or a business plan.\
            There are two people: you, the founder and a customer who has a problem. Your startup idea is the solution to the customer's problem.",
            "parameters": {
                "type": "object",
                "properties": {
                    "scenario": {
                        "type": "string",
                        "description": "Example: A bustling university campus café. Students are scattered everywhere with books, laptops, and coffee cups. You, the founder of a startup, sit down with Alex, a third-year student majoring in History."
                    },

                },
                "required": ["scenario"]
            }
        }
    ]

    const prompt = `${startup_idea}.
    Given this startup idea, create a possible scenario between the you, the founder and a possible customer.
    The customer has a problem, and the founder's startup idea is the solution to the customer's problem.`

    const messages = [{ "role": "user", "content": prompt }];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        functions: functions,
        function_call: {
            "name": "create_scenario",
        }
    })

    return response;
}

export async function create_dialogue(scenario, dialogue, startup_idea) {
    const functions = [
        {
            "name": "create_dialogue",
            "description": "Creates a brief dialogue between the you and the customer. The dialogue always ends with a customers last line of dialogue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "dialogue": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "description": "A line of dialogue, continuing the conversation between you and the customer."
                        },
                        "minItems": 2,
                        "maxItems": 2,
                    },
                    "correct_intention" : {
                        "type": "string",
                        "description": "A description of your intention behind the correct_dialogue. It is phrased like a video game choice."
                    },
                    "correct_dialogue": {
                        "type": "string",
                        "description": "At the end of the dialogue, the user will make a choice about what to ask the customer next. This is the correct choice, according to the mom test."
                    },
                    "correct_choice_reasoning": {
                        "type": "string",
                        "description": "Reasoning for why the correct choice is correct. It refers to principles from the mom test."
                    },
                    "incorrect_intention" : {
                        "type": "string",
                        "description": "A description of your intention behind the incorrect_dialogue. It is phrased like a video game choice. ",
                    },
                    "incorrect_dialogue": {
                        "type": "string",
                        "description": "At the end of the dialogue, the user will make a choice about what to ask the customer next. This will be the natural choice, but will be wrong."
                    },
                    "incorrect_choice_reasoning": {
                        "type": "string",
                        "description": "Reasoning for why the incorrect choice is incorrect. It refers to principles from the mom test."
                    },
                },
                "required": ["dialogue", "correct_intention", "correct_dialogue", "correct_choice_reasoning", "incorrect_intention", "incorrect_dialogue", "incorrect_choice_reasoning"]
            }
        }
    ]

    const dialogue_string = dialogue.join("\n")
    const prompt = `${scenario}.
    ${dialogue_string}
    ${startup_idea}
    Given this scenario, continue the dialogue between the 'you' and the customer.
    It continues the conversation, only generating 3-4 lines of dialogue.`

    const messages = [{
        "role": "user", "content": "The Mom Test: 1. Talk about their life, not your idea. Instead of leading with your product, ask about the person's experiences, challenges, and tasks. This elicits genuine feedback without bias. 2. Ask about the past, not the future. Instead of asking 'Would you use a product like X?', inquire about how they've handled relevant situations in the past. Past behaviors are a more reliable indicator than hypothetical future actions. 3. Listen more, talk less. Avoid the temptation to defend or extensively explain your idea. The goal is to gather insights, so prioritize understanding their perspective."
    },
    { "role": "user", "content": prompt }];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        functions: functions,
        function_call: {
            "name": "create_dialogue",
        }
    })

    return response;

}