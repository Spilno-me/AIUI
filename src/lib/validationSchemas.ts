import { z } from 'zod';

export const welcomeStepSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(50, 'Password must be less than 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
});

export const companyStepSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  numberOfEmployees: z.string().min(1, 'Please select number of employees'),
  goals: z.string().min(10, 'Please tell us a bit more about your goals (at least 10 characters)').max(500, 'Goals must be less than 500 characters'),
  subscribeToUpdates: z.boolean(),
});

export const personalizationStepSchema = z.object({
  vibe: z.enum(['builder', 'dreamer', 'hacker', 'visionary'], {
    required_error: 'Please select your vibe',
  }),
  favoriteColor: z.string().min(1, 'Please select a favorite color'),
});

export type WelcomeStepData = z.infer<typeof welcomeStepSchema>;
export type CompanyStepData = z.infer<typeof companyStepSchema>;
export type PersonalizationStepData = z.infer<typeof personalizationStepSchema>; 