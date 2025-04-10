'use server';
/**
 * @fileOverview Generates Bangla captions for a given image using an AI model.
 *
 * - generateBanglaCaptions - A function that generates Bangla captions for an image.
 * - GenerateBanglaCaptionsInput - The input type for the generateBanglaCaptions function.
 * - GenerateBanglaCaptionsOutput - The return type for the generateBanglaCaptions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateBanglaCaptionsInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to generate captions for.'),
  numberOfCaptions: z.number().default(3).describe('The number of captions to generate.'),
});
export type GenerateBanglaCaptionsInput = z.infer<typeof GenerateBanglaCaptionsInputSchema>;

const GenerateBanglaCaptionsOutputSchema = z.object({
  captions: z.array(
    z.string().describe('A generated Bangla caption for the image.')
  ).describe('The generated Bangla captions.')
});
export type GenerateBanglaCaptionsOutput = z.infer<typeof GenerateBanglaCaptionsOutputSchema>;

export async function generateBanglaCaptions(input: GenerateBanglaCaptionsInput): Promise<GenerateBanglaCaptionsOutput> {
  return generateBanglaCaptionsFlow(input);
}

const generateBanglaCaptionsPrompt = ai.definePrompt({
  name: 'generateBanglaCaptionsPrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image to generate captions for.'),
      numberOfCaptions: z.number().describe('The number of captions to generate.'),
    }),
  },
  output: {
    schema: z.object({
      captions: z.array(
        z.string().describe('A generated Bangla caption for the image.')
      ).describe('The generated Bangla captions.')
    }),
  },
  prompt: `You are an AI model specialized in generating Bangla captions for images. Generate {{{numberOfCaptions}}} Bangla captions for the following image. Ensure the captions are relevant to the image content and suitable for social media posts.\n\nImage: {{media url=imageUrl}}\n\nCaptions:`, 
});

const generateBanglaCaptionsFlow = ai.defineFlow<
  typeof GenerateBanglaCaptionsInputSchema,
  typeof GenerateBanglaCaptionsOutputSchema
>(
  {
    name: 'generateBanglaCaptionsFlow',
    inputSchema: GenerateBanglaCaptionsInputSchema,
    outputSchema: GenerateBanglaCaptionsOutputSchema,
  },
  async input => {
    const {output} = await generateBanglaCaptionsPrompt(input);
    return output!;
  }
);
