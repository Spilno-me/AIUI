import { z } from 'zod';

export const welcomeStepSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters').max(50, 'Full name must be less than 50 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters').max(50, 'Password must be less than 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
});

export const companyStepSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  numberOfEmployees: z.string().min(1, 'Please select number of employees'),
  goals: z.string().trim().min(1, 'Goals are required').min(10, 'Please tell us a bit more about your goals (at least 10 characters)').max(500, 'Goals must be less than 500 characters'),
  subscribeToUpdates: z.boolean(),
});

export type WelcomeStepData = z.infer<typeof welcomeStepSchema>;
export type CompanyStepData = z.infer<typeof companyStepSchema>; 