"use client";

import React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { autoFillFormField } from '@/ai/flows/auto-fill-form-field';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  coverLetter: z.string().optional(),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      coverLetter: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Form submitted.",
      description: "Your information has been successfully submitted.",
    });
  }

  const handleAutoFill = async (field: string) => {
    try {
      let aiResult;
      switch (field) {
        case "fullName":
          aiResult = await autoFillFormField({
            fieldLabel: "Full Name",
            pageContent: "Job Application Form",
            userInfo: "User applying for a job",
          });
          form.setValue("fullName", aiResult.filledValue);
          break;
        case "email":
          aiResult = await autoFillFormField({
            fieldLabel: "Email Address",
            pageContent: "Job Application Form",
            userInfo: "User applying for a job",
          });
          form.setValue("email", aiResult.filledValue);
          break;
        case "coverLetter":
          aiResult = await autoFillFormField({
            fieldLabel: "Cover Letter",
            pageContent: "Job Application Form",
            userInfo: "User applying for a job",
          });
          form.setValue("coverLetter", aiResult.filledValue);
          break;
        default:
          console.warn("Unknown field for auto-fill:", field);
          return;
      }

      if (aiResult) {
        toast({
          title: `Auto-filled ${field}`,
          description: `Successfully auto-filled ${field} with AI.`,
        });
      }
    } catch (error: any) {
      console.error("Error during auto-fill:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to auto-fill ${field}. ${error.message}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-semibold">Job Application Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="John Doe" {...field} />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => handleAutoFill("fullName")}
                    >
                      <Icons.magicWand className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>Enter your full name.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="johndoe@example.com" {...field} />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => handleAutoFill("email")}
                    >
                      <Icons.magicWand className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Write a brief cover letter..."
                      className="resize-none"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2"
                      onClick={() => handleAutoFill("coverLetter")}
                    >
                      <Icons.magicWand className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Write a brief cover letter explaining why you are a good fit for this role.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

