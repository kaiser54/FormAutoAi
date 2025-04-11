'use server';
/**
 * @fileOverview An AI agent to intelligently fill form fields.
 *
 * - autoFillFormField - A function that handles the auto-filling of a form field.
 * - AutoFillFormFieldInput - The input type for the autoFillFormField function.
 * - AutoFillFormFieldOutput - The return type for the autoFillFormField function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AutoFillFormFieldInputSchema = z.object({
  fieldLabel: z.string().describe('The label or context of the form field to be filled.'),
  pageContent: z.string().describe('The content of the current web page for context.'),
  userInfo: z.string().optional().describe('Optional user information to personalize the filling.'),
});
export type AutoFillFormFieldInput = z.infer<typeof AutoFillFormFieldInputSchema>;

const AutoFillFormFieldOutputSchema = z.object({
  filledValue: z.string().describe('The AI-generated value to fill the form field with.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the AI in the filled value.'),
});
export type AutoFillFormFieldOutput = z.infer<typeof AutoFillFormFieldOutputSchema>;

export async function autoFillFormField(input: AutoFillFormFieldInput): Promise<AutoFillFormFieldOutput> {
  return autoFillFormFieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFillFormFieldPrompt',
  input: {
    schema: z.object({
      fieldLabel: z.string().describe('The label or context of the form field to be filled.'),
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

You will be provided with the label or context of a form field, the content of the current web page, and optional user information.
Your goal is to generate the most relevant and accurate value for the field based on the provided information.

Field Label: {{{fieldLabel}}}
Page Content: {{{pageContent}}}
User Information: {{{userInfo}}}

Provide the filled value and a confidence score (0-1) indicating the accuracy of the filled value.
Ensure that the filled value is appropriate and relevant to the context of the form field.
`,
});

const autoFillFormFieldFlow = ai.defineFlow<
  typeof AutoFillFormFieldInputSchema,
  typeof AutoFillFormFieldOutputSchema
>(
  {
    name: 'autoFillFormFieldFlow',
    inputSchema: AutoFillFormFieldInputSchema,
    outputSchema: AutoFillFormFieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
