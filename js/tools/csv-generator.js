import { Logger } from '../utils/logger.js';

export class CSVGeneratorTool {
    getDeclaration() {
        return [{
            name: "generate_csv",
            description: "Generates CSV data for testing or demonstration purposes.",
            parameters: {
                type: "object",
                properties: {
                    rows: {
                        type: "number",
                        description: "The number of rows to generate."
                    },
                    columns: {
                        type: "array",
                        description: "The columns to include in the CSV.",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: ["rows", "columns"]
            }
        }];
    }

    async execute(args) {
        try {
            Logger.info('Generating CSV data', args);
            let csvContent = args.columns.join(",") + "\n";
            for (let i = 0; i < args.rows; i++) {
                const row = args.columns.map(col => `data_${col}_${i}`).join(",");
                csvContent += row + "\n";
            }
            return { success: true, csvContent };
        } catch (error) {
            Logger.error('CSV generation failed', error);
            throw error;
        }
    }
}