'use client';

import {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateBanglaCaptions} from '@/ai/flows/generate-bangla-captions';
import {Copy, ImageIcon} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const {toast} = useToast();

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateCaptions = useCallback(async () => {
    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    const result = await generateBanglaCaptions({imageUrl: image});
    setCaptions(result.captions);
  }, [image]);

  const handleCopyCaption = useCallback((caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      title: 'Caption Copied',
      description: 'Caption has been copied to clipboard.',
    });
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-background">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Bangla Captioner</h1>

      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Upload an image to generate Bangla captions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-accent">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-4 text-primary" />
                <p className="mb-2 text-sm text-muted-foreground ">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>

          {image && (
            <div className="relative">
              <img src={image} alt="Uploaded" className="w-full rounded-md aspect-video object-cover" />
            </div>
          )}

          <Button onClick={handleGenerateCaptions} disabled={!image}>Generate Captions</Button>
        </CardContent>
      </Card>

      {captions.length > 0 && (
        <Card className="w-full max-w-md mt-8 space-y-4">
          <CardHeader>
            <CardTitle>Generated Captions</CardTitle>
            <CardDescription>Tap a caption to copy it.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {captions.map((caption, index) => (
              <div key={index} className="relative">
                <Textarea
                  readOnly
                  value={caption}
                  className="w-full bg-muted resize-none rounded-md pr-10"
                  onClick={() => handleCopyCaption(caption)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopyCaption(caption)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
