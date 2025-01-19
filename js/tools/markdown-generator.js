import { Logger } from '../utils/logger.js';

export class MarkdownGeneratorTool {
    getDeclaration() {
        return [{
            name: "generate_markdown",
            description: "Generates a markdown file to showcase artifacts like code snippets or documentation.",
            parameters: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "The title of the markdown document."
                    },
                    content: {
                        type: "string",
                        description: "The content to include in the markdown document."
                    }
                },
                required: ["title", "content"]
            }
        }];
    }

    async execute(args) {
        try {
            Logger.info('Generating markdown', args);
            const markdownContent = `# ${args.title}\n\n${args.content}`;
            return { success: true, markdownContent };
        } catch (error) {
            Logger.error('Markdown generation failed', error);
            throw error;
        }
    }
}