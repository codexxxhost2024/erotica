import { Logger } from '../utils/logger.js';

export class EmailSenderTool {
    getDeclaration() {
        return [{
            name: "send_email",
            description: "Sends an email to the specified recipient with the provided subject and body content.",
            parameters: {
                type: "object",
                properties: {
                    to: {
                        type: "string",
                        description: "The recipient's email address."
                    },
                    subject: {
                        type: "string",
                        description: "The subject of the email."
                    },
                    body: {
                        type: "string",
                        description: "The body content of the email."
                    }
                },
                required: ["to", "subject", "body"]
            }
        }];
    }

    async execute(args) {
        try {
            Logger.info('Sending email', args);

            // Simulate sending an email
            const emailResponse = {
                to: args.to,
                subject: args.subject,
                body: args.body,
                status: "Email sent successfully"
            };

            // Log the email response
            Logger.info('Email sent successfully', emailResponse);

            return { success: true, message: `Email sent to ${args.to}`, details: emailResponse };
        } catch (error) {
            Logger.error('Email sending failed', error);
            throw error;
        }
    }
}