'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing form data.
 *
 * - summarizeFormData - A function that summarizes the data filled in a form.
 * - SummarizeFormDataInput - The input type for the summarizeFormData function.
 * - SummarizeFormDataOutput - The return type for the summarizeFormData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeFormDataInputSchema = z.object({
  formData: z.record(z.string()).describe('A record of form field IDs to their filled values.'),
  formContext: z.string().describe('The context of the form (e.g., job application, loan application).'),
});
export type SummarizeFormDataInput = z.infer<typeof SummarizeFormDataInputSchema>;

const SummarizeFormDataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the data filled in the form.'),
});
export type SummarizeFormDataOutput = z.infer<typeof SummarizeFormDataOutputSchema>;

export async function summarizeFormData(input: SummarizeFormDataInput): Promise<SummarizeFormDataOutput> {
  return summarizeFormDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFormDataPrompt',
  input: {
    schema: z.object({
      formData: z.record(z.string()).describe('A record of form field IDs to their filled values.'),
      formContext: z.string().describe('The context of the form (e.g., job application, loan application).'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the data filled in the form.'),
    }),
  },
  prompt: `You are an AI assistant designed to summarize data from forms.

  Based on the data provided ({{{formData}}}) and the context of the form ({{{formContext}}}), create a concise summary of the information provided in the form.

  The summary should highlight key details and provide an overview of the filled data.
  `,
});

const summarizeFormDataFlow = ai.defineFlow<
  typeof SummarizeFormDataInputSchema,
  typeof SummarizeFormDataOutputSchema
>({
  name: 'summarizeFormDataFlow',
  inputSchema: SummarizeFormDataInputSchema,
  outputSchema: SummarizeFormDataOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
