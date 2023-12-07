// dependencies
require('dotenv').config();
const { OpenAI } = require('langchain/llms/openai');
const inquirer = require('inquirer');
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Javascript code that answers the user's question",
  explanation: "detailed explanation of the example code provided",
});

const formatInstructions = parser.getFormatInstructions();

const model = new OpenAI({ 
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    model: 'gpt-3.5-turbo'
  });

  // promptFunc sends the imput to the model
const promptFunc = async (input) => {
    try {
        const res = await model.call(input);
    
        // Instantiation of a new object called "prompt" using the "PromptTemplate" class
        const prompt = new PromptTemplate({
          template: "You are a software test engineering and QA expert, and will answer the user's software testing questions as thorough and accurate as possible, with citations.\n{format_instructions}\n{question}",
          inputVariables: ["question"],
          partialVariables: { format_instructions: formatInstructions }
        });
    
        const promptInput = await prompt.format({
          question: input
        });
        
        console.log(await parser.parse(res));
    
    }
    catch (err) {
        console.error(err);
    }
    };
      

const init = () => {
inquirer.prompt([
    {
    type: 'input',
    name: 'name',
    message: 'Ask me a test engineering question:',
    },
]).then((inquirerResponse) => {
    promptFunc(inquirerResponse.name)
});
};

init();
  