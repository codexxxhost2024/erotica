import { Logger } from '../utils/logger.js';

export class PersonaGeneratorTool {
    getDeclaration() {
        return [{
            name: "generate_persona",
            description: "Generates a persona for AI prompts, tailored to specific use cases.",
            parameters: {
                type: "object",
                properties: {
                    role: {
                        type: "string",
                        description: "The role of the persona (e.g., developer, marketer)."
                    },
                    goal: {
                        type: "string",
                        description: "The goal of the persona (e.g., write code, create content)."
                    }
                },
                required: ["role", "goal"]
            }
        }];
    }

    async execute(args) {
        try {
            Logger.info('Generating persona', args);
            const persona = `You are a ${args.role} whose goal is to ${args.goal}.`;
            return { success: true, persona };
        } catch (error) {
            Logger.error('Persona generation failed', error);
            throw error;
        }
    }
}