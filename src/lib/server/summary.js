import { OPENAI_KEY } from "$env/static/private";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: OPENAI_KEY,
});

// Progress bar with specific concepts
export async function create_summary(questions) {
    const functions = [
        {
            "name": "create_summary",
            "description": "Creates a comprehensive summary for a student's attempt at a quiz. \
            The feedback is addressed to the student.",
            "parameters": {
                "type": "object",
                "properties": {
                    "overall_performance": {
                        "type": "string",
                        "description": "An overview that commends the student's correct answers and strengths. \
                        It acknowledges specific areas of understanding, and if possible, mentions questions or topics they excelled in. \
                        It is formatted in markdown. \
                        Example: '### Overall Performance & Achievements\n\n- 🌟 Outstanding Work: You've shown a deep understanding of thermodynamics.\n- 📚 Consistent Performance: Across the board, your answers displayed a solid grasp of entropy, heat and work. Keep the momentum going!'",
                    },
                    "areas_for_improvement_trends": {
                        "type": "string",
                        "description": "A constructive segment that helps the student identify areas for growth. This feedback should spotlight patterns of mistakes or gaps in understanding, using markdown for clear formatting. It is formatted in markdown.",
                        "example": "### Areas for Improvement & Trends\n\n- ❗ Vector Calculus: There seems to be a consistent challenge with questions related to vector calculus, particularly in questions 9 and 10. Consider revisiting chapter 5 in your textbook for a refresher.\n- 🔍 Attention to Detail: A few of your answers, like in question 6, were close but missed some minor points. It might be helpful to slow down and review your answers before finalising them."
                    },
                },
                "required": ["overall_performance", "areas_for_improvement_trends"]
            }
        }
    ]

    const text = questions_to_text(questions)

    const prompt = `${text}.\
    You are a teaching assistant bot that creates a comprehensive summary for a student's attempt at a quiz.`

    console.log(prompt);

    const messages = [{ "role": "user", "content": prompt }];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        functions: functions,
        function_call: {
            "name": "create_summary",
        }
    })

    return response;
}

export async function extract_concept_mastery(questions) {

    const functions = [
        {
            "name": "extract_concept_mastery",
            "description": "Selects the most relevant concepts from a student's attempt at a quiz. \
            Determines the student's mastery of each concept out of 100.",
            "parameters": {
                "type": "object",
                "properties": {
                    "concept_mastery": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "concept": {
                                    "type": "string",
                                    "description": "The concept that the student was tested on.",
                                    "example": "Vector Calculus"
                                },
                                "mastery": {
                                    "type": "number",
                                    "description": "The student's mastery of the concept, out of 100.",
                                    "example": 80
                                }
                            },
                        },
                        "minItems": 2,
                        "maxItems": 4,
                        "description": "A list of concepts and their respective mastery levels."
                    }
                }
            }
        }
    ]

    const text = questions_to_text(questions)

    const prompt = `You are a teaching assistant bot that selects the most relevant concepts from a student's attempt at a quiz. \
    The questions are: ${text}.`

    const messages = [{ "role": "user", "content": prompt }];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        functions: functions,
        function_call: {
            "name": "extract_concept_mastery",
        }
    })

    return response;
}

const questions_to_text = (questions) => {
    let resultText = '';

    questions.forEach(question => {
        const q = question.questions.question;
        const feedback = question.feedback;

        resultText += `Question: ${q.question}\n`;
        resultText += `Your Answer: ${question.answer}\n`;
        resultText += `Model Answer: ${q.answer}\n`;
        resultText += `Justification: ${q.justification}\n`;
        resultText += `Type: ${q.type}\n`;
        resultText += `Quality: ${feedback.quality}\n`;

        // Only include reasoning and tip_for_improvement for 'understanding' type questions
        if (q.type === 'understanding') {
            resultText += `Reasoning: ${feedback.reasoning}\n`;
            resultText += `Tip for Improvement: ${feedback.tip_for_improvement}\n`;
        }
        resultText += '\n';  // Separate each question with a newline
    });

    return resultText;
}