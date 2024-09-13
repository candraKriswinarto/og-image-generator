'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Check, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deploymentURL } from '@/constant/env';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.union([z.string().url(), z.string().length(0)]).optional(),
});

export default function OgForm() {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('title', 'Welcome to My Site');
    params.append('description', 'Hendrerit elit dictumst si velit');
    params.append('logUrl', `${deploymentURL}/images/logo.png`);

    const ogImageUrl = `/api/og?${params.toString()}`;
    setPreviewUrl(ogImageUrl);
  }, []);

  const handleCopyUrl = () => {
    const fullUrl = `${deploymentURL}${previewUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      logoUrl: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description, logoUrl } = values;

    const params = new URLSearchParams();
    if (title) {
      params.append('title', title);
    }
    if (description) {
      params.append('description', description);
    }
    if (logoUrl) {
      params.append('logoUrl', logoUrl);
    }

    const ogImageUrl = `/api/og?${params.toString()}`;
    setPreviewUrl(ogImageUrl);
  }

  interface FormField {
    label: string;
    field: 'title' | 'description' | 'logoUrl';
  }
  const formFieldList: FormField[] = [
    { label: 'Title', field: 'title' },
    { label: 'Description', field: 'description' },
    { label: 'Image', field: 'logoUrl' },
  ];

  return (
    <div className='max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-6 md:space-y-0 space-y-6 px-4 py-12'>
      <div className='bg-card p-6 rounded-lg border shadow-md'>
        <h2 className='text-2xl font-bold mb-4'>Open Graph Image Generator</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {formFieldList.map((item, index) => (
              <div key={index}>
                <FormField
                  control={form.control}
                  name={item.field}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input placeholder='Type the title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type='submit' className='w-full'>
              Generate ☘️
            </Button>
          </form>
        </Form>
      </div>
      <div className='bg-card p-6 rounded-lg border shadow-md'>
        <div className='bg-muted rounded-lg overflow-hidden'>
          {previewUrl && (
            <Image
              src={previewUrl}
              alt='Open Graph Image'
              width={1200}
              height={630}
              className='w-full h-full object-cover'
            />
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <span className='mt-4'>Generated URL:</span>
          <div className='bg-muted rounded-md px-3 py-2 flex items-center justify-between'>
            <span className='text-sm truncate'>{`${deploymentURL}${previewUrl}`}</span>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:bg-muted'
              onClick={handleCopyUrl}
            >
              {copied ? (
                <Check className='w-4 h-4' />
              ) : (
                <CopyIcon className='w-4 h-4' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
