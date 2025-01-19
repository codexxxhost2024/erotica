import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';
import { GoogleSearchTool } from './google-search.js';
import { WeatherTool } from './weather-tool.js';
import { DocumentGeneratorTool } from './document-generator.js';
import { EmailSenderTool } from './email-sender.js';
import { MemoryStorageTool } from './memory-storage.js';
import { ImageGeneratorTool } from './image-generator.js';
import { UnitConverterTool } from './unit-converter.js';
import { RandomNumberGeneratorTool } from './random-number-generator.js';
import { TextSummarizerTool } from './text-summarizer.js';
import { TimeZoneConverterTool } from './time-zone-converter.js';
import { CurrencyConverterTool } from './currency-converter.js';
import { FactGeneratorTool } from './fact-generator.js';
import { MarkdownGeneratorTool } from './markdown-generator.js';
import { PersonaGeneratorTool } from './persona-generator.js';
import { CSVGeneratorTool } from './csv-generator.js';
import { SQLGeneratorTool } from './sql-generator.js';
import { SourceCodeGeneratorTool } from './source-code-generator.js';
import { WebScraperTool } from './web-scraper.js';
import { YouTubeSummarizerTool } from './youtube-summarizer.js';

/**
 * Manages the registration and execution of tools.
 * Tools are used to extend the functionality of the Gemini API, allowing it to interact with external services.
 */
export class ToolManager {
    /**
     * Creates a new ToolManager and registers default tools.
     */
    constructor() {
        this.tools = new Map();
        this.registerDefaultTools();
    }

    /**
     * Registers the default tools.
     */
    registerDefaultTools() {
        // Original tools
        this.registerTool('googleSearch', new GoogleSearchTool());
        this.registerTool('weather', new WeatherTool());

        // New tools for document generation, email sending, etc.
        this.registerTool('documentGenerator', new DocumentGeneratorTool());
        this.registerTool('emailSender', new EmailSenderTool());
        this.registerTool('memoryStorage', new MemoryStorageTool());
        this.registerTool('imageGenerator', new ImageGeneratorTool());
        this.registerTool('unitConverter', new UnitConverterTool());
        this.registerTool('randomNumberGenerator', new RandomNumberGeneratorTool());
        this.registerTool('textSummarizer', new TextSummarizerTool());
        this.registerTool('timeZoneConverter', new TimeZoneConverterTool());
        this.registerTool('currencyConverter', new CurrencyConverterTool());
        this.registerTool('factGenerator', new FactGeneratorTool());

        // Tools for AI news, coding, and data generation
        this.registerTool('markdownGenerator', new MarkdownGeneratorTool());
        this.registerTool('personaGenerator', new PersonaGeneratorTool());
        this.registerTool('csvGenerator', new CSVGeneratorTool());
        this.registerTool('sqlGenerator', new SQLGeneratorTool());
        this.registerTool('sourceCodeGenerator', new SourceCodeGeneratorTool());
        this.registerTool('webScraper', new WebScraperTool());
        this.registerTool('youtubeSummarizer', new YouTubeSummarizerTool());
    }

    /**
     * Registers a new tool.
     *
     * @param {string} name - The name of the tool.
     * @param {Object} toolInstance - The tool instance. Must have a `getDeclaration` method.
     * @throws {ApplicationError} Throws an error if a tool with the same name is already registered.
     */
    registerTool(name, toolInstance) {
        if (this.tools.has(name)) {
            throw new ApplicationError(
                `Tool ${name} is already registered`,
                ErrorCodes.INVALID_STATE
            );
        }
        this.tools.set(name, toolInstance);
        Logger.info(`Tool ${name} registered successfully`);
    }

    /**
     * Returns the tool declarations for all registered tools.
     * These declarations are used by the Gemini API to understand what tools are available.
     *
     * @returns {Object[]} An array of tool declarations.
     */
    getToolDeclarations() {
        const allDeclarations = [];
        
        this.tools.forEach((tool, name) => {
            if (tool.getDeclaration) {
                if (name === 'weather') {
                    allDeclarations.push({
                        functionDeclarations: tool.getDeclaration()
                    });
                } else {
                    allDeclarations.push({ [name]: tool.getDeclaration() });
                }
            }
        });

        return allDeclarations;
    }

    /**
     * Handles a tool call from the Gemini API.
     * Executes the specified tool with the given arguments.
     *
     * @param {Object} functionCall - The function call object from the Gemini API.
     * @param {string} functionCall.name - The name of the tool to execute.
     * @param {Object} functionCall.args - The arguments to pass to the tool.
     * @param {string} functionCall.id - The ID of the function call.
     * @returns {Promise<Object>} A promise that resolves with the tool's response.
     * @throws {ApplicationError} Throws an error if the tool is unknown or if the tool execution fails.
     */
    async handleToolCall(functionCall) {
        const { name, args, id } = functionCall;
        Logger.info(`Handling tool call: ${name}`, { args });

        let tool;
        if (name === 'get_weather_on_date') {
            tool = this.tools.get('weather');
        } else {
            tool = this.tools.get(name);
        }

        if (!tool) {
            throw new ApplicationError(
                `Unknown tool: ${name}`,
                ErrorCodes.INVALID_PARAMETER
            );
        }

        try {
            const result = await tool.execute(args);
            return {
                functionResponses: [{
                    response: { output: result },
                    id
                }]
            };
        } catch (error) {
            Logger.error(`Tool execution failed: ${name}`, error);
            return {
                functionResponses: [{
                    response: { error: error.message },
                    id
                }]
            };
        }
    }
}