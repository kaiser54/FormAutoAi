'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant content for form fields.
 *
 * - suggestRelevantContent - A function that suggests content for a given form field.
 * - SuggestRelevantContentInput - The input type for the suggestRelevantContent function.
 * - SuggestRelevantContentOutput - The return type for the suggestRelevantContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestRelevantContentInputSchema = z.object({
  fieldId: z.string().describe('The ID of the form field.'),
  fieldLabel: z.string().describe('The label of the form field.'),
  fieldContext: z.string().describe('The context of the form field (e.g., job title, company name).'),
  userData: z.string().optional().describe('User-provided data for context.'),
});
export type SuggestRelevantContentInput = z.infer<typeof SuggestRelevantContentInputSchema>;

const SuggestRelevantContentOutputSchema = z.object({
  suggestedContent: z.string().describe('The AI-generated content suggested for the form field.'),
});
export type SuggestRelevantContentOutput = z.infer<typeof SuggestRelevantContentOutputSchema>;

export async function suggestRelevantContent(input: SuggestRelevantContentInput): Promise<SuggestRelevantContentOutput> {
  return suggestRelevantContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantContentPrompt',
  input: {
    schema: z.object({
      fieldId: z.string().describe('The ID of the form field.'),
      fieldLabel: z.string().describe('The label of the form field.'),
      fieldContext: z.string().describe('The context of the form field (e.g., job title, company name).'),
      userData: z.string().optional().describe('User-provided data for context.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedContent: z.string().describe('The AI-generated content suggested for the form field.'),
    }),
  },
  prompt: `You are an AI assistant designed to help users fill out job application forms.

  Based on the context of the form field ({{{fieldContext}}}), its label ({{{fieldLabel}}}), and any available user data ({{{userData}}}), generate relevant content for the field.

  Provide a concise and accurate suggestion.
  `,
});

const suggestRelevantContentFlow = ai.defineFlow<
  typeof SuggestRelevantContentInputSchema,
  typeof SuggestRelevantContentOutputSchema
>({
  name: 'suggestRelevantContentFlow',
  inputSchema: SuggestRelevantContentInputSchema,
  outputSchema: SuggestRelevantContentOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
