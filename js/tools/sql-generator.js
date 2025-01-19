import { Logger } from '../utils/logger.js';

export class SQLGeneratorTool {
    getDeclaration() {
        return [{
            name: "generate_sql",
            description: "Generates SQL insert statements for testing or populating databases.",
            parameters: {
                type: "object",
                properties: {
                    tableName: {
                        type: "string",
                        description: "The name of the table."
                    },
                    columns: {
                        type: "array",
                        description: "The columns to include in the SQL insert.",
                        items: {
                            type: "string"
                        }
                    },
                    rows: {
                        type: "number",
                        description: "The number of rows to generate."
                    }
                },
                required: ["tableName", "columns", "rows"]
            }
        }];
    }

    async execute(args) {
        try {
            Logger.info('Generating SQL data', args);
            let sqlContent = "";
            for (let i = 0; i < args.rows; i++) {
                const values = args.columns.map(col => `'data_${col}_${i}'`).join(", ");
                sqlContent += `INSERT INTO ${args.tableName} (${args.columns.join(", ")}) VALUES (${values});\n`;
            }
            return { success: true, sqlContent };
        } catch (error) {
            Logger.error('SQL generation failed', error);
            throw error;
        }
    }
}