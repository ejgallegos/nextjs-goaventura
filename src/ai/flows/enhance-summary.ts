// src/ai/flows/enhance-summary.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing user-generated summaries with missing important details.
 *
 * The flow takes an original text and a user-provided summary as input.
 * It uses GenAI to identify and add any crucial information missing from the summary.
 * The flow returns the enhanced summary.
 *
 * - enhanceSummary - A function that takes the original text and user summary and returns an enhanced summary.
 * - EnhanceSummaryInput - The input type for the enhanceSummary function.
 * - EnhanceSummaryOutput - The return type for the enhanceSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSummaryInputSchema = z.object({
  originalText: z
    .string()
    .describe('The original text content to generate the summary from.'),
  userSummary: z
    .string()
    .describe('The user-provided summary that needs to be enhanced.'),
});
export type EnhanceSummaryInput = z.infer<typeof EnhanceSummaryInputSchema>;

const EnhanceSummaryOutputSchema = z.object({
  enhancedSummary: z
    .string()
    .describe('The enhanced summary with any missing important details added.'),
});
export type EnhanceSummaryOutput = z.infer<typeof EnhanceSummaryOutputSchema>;

export async function enhanceSummary(input: EnhanceSummaryInput): Promise<EnhanceSummaryOutput> {
  return enhanceSummaryFlow(input);
}

const enhanceSummaryPrompt = ai.definePrompt({
  name: 'enhanceSummaryPrompt',
  input: {schema: EnhanceSummaryInputSchema},
  output: {schema: EnhanceSummaryOutputSchema},
  prompt: `You are an expert summarizer. Your task is to enhance a user-provided summary by adding any important details that are missing from the original text.

Original Text:
{{originalText}}

User Summary:
{{userSummary}}

Enhanced Summary:`,
});

const enhanceSummaryFlow = ai.defineFlow(
  {
    name: 'enhanceSummaryFlow',
    inputSchema: EnhanceSummaryInputSchema,
    outputSchema: EnhanceSummaryOutputSchema,
  },
  async input => {
    const {output} = await enhanceSummaryPrompt(input);
    return output!;
  }
);
