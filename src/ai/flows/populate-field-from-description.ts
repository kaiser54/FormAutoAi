'use server';
/**
 * @fileOverview This file defines a Genkit flow for populating a form field based on its description.
 *
 * - populateFieldFromDescription - A function that populates a form field with relevant information.
 * - PopulateFieldFromDescriptionInput - The input type for the populateFieldFromDescription function.
 * - PopulateFieldFromDescriptionOutput - The return type for the populateFieldFromDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PopulateFieldFromDescriptionInputSchema = z.object({
  fieldDescription: z.string().describe('The description or label of the form field.'),
  pageContent: z.string().describe('The content of the current web page for context.'),
  userInfo: z.string().optional().describe('Optional user information to personalize the filling.'),
});
export type PopulateFieldFromDescriptionInput = z.infer<typeof PopulateFieldFromDescriptionInputSchema>;

const PopulateFieldFromDescriptionOutputSchema = z.object({
  filledValue: z.string().describe('The AI-generated value to fill the form field with.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the AI in the filled value.'),
});
export type PopulateFieldFromDescriptionOutput = z.infer<typeof PopulateFieldFromDescriptionOutputSchema>;

export async function populateFieldFromDescription(
  input: PopulateFieldFromDescriptionInput
): Promise<PopulateFieldFromDescriptionOutput> {
  return populateFieldFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'populateFieldFromDescriptionPrompt',
  input: {
    schema: z.object({
      fieldDescription: z.string().describe('The description or label of the form field.'),
      pageContent: z.string().describe('The content of the current web page for context.'),
      userInfo: z.string().optional().describe('Optional user information to personalize the filling.'),
    }),
  },
  output: {
    schema: z.object({
      filledValue: z.string().describe('The AI-generated value to fill the form field with.'),
      confidenceScore: z.number().describe('A score indicating the confidence level of the AI in the filled value.'),
    }),
  },
  prompt: `You are an AI assistant designed to help users quickly fill out job application forms.

  You will be provided with the description of a form field, the content of the current web page, and optional user information.
  Your goal is to generate the most relevant and accurate value for the field based on the provided information.

  Field Description: {{{fieldDescription}}}
  Page Content: {{{pageContent}}}
  User Information: {{{userInfo}}}

  Provide the filled value and a confidence score (0-1) indicating the accuracy of the filled value.
  Ensure that the filled value is appropriate and relevant to the context of the form field.
  `,
});

const populateFieldFromDescriptionFlow = ai.defineFlow<
  typeof PopulateFieldFromDescriptionInputSchema,
  typeof PopulateFieldFromDescriptionOutputSchema
>({
  name: 'populateFieldFromDescriptionFlow',
  inputSchema: PopulateFieldFromDescriptionInputSchema,
  outputSchema: PopulateFieldFromDescriptionOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
