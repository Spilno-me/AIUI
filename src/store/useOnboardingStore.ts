import { create } from 'zustand';

export interface OnboardingData {
  // Step 1: Welcome & User Info
  fullName: string;
  email: string;
  password: string;
  industry: string;
  
  // Step 2: Company Details
  companyName: string;
  numberOfEmployees: string;
  goals: string;
  subscribeToUpdates: boolean;
  
  // Step 3: Personalization
  vibe: 'builder' | 'dreamer' | 'hacker' | 'visionary' | undefined;
  favoriteColor: string;
}

export interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  isCompleted: boolean;
  completedSteps: Set<number>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateUserInfo: (info: Partial<Pick<OnboardingData, 'fullName' | 'email' | 'password' | 'industry'>>) => void;
  updateCompanyDetails: (details: Partial<Pick<OnboardingData, 'companyName' | 'numberOfEmployees' | 'goals' | 'subscribeToUpdates'>>) => void;
  updatePersonalization: (personalization: Partial<Pick<OnboardingData, 'vibe' | 'favoriteColor'>>) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  markStepCompleted: (step: number) => void;
  isStepAccessible: (step: number) => boolean;
}

const initialData: OnboardingData = {
  fullName: '',
  email: '',
  password: '',
  industry: '',
  companyName: '',
  numberOfEmployees: '',
  goals: '',
  subscribeToUpdates: false,
  vibe: undefined,
  favoriteColor: '#3b82f6',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  data: initialData,
  isCompleted: false,
  completedSteps: new Set(), // No steps completed initially
  
  setCurrentStep: (step: number) => {
    const { isStepAccessible } = get();
    if (isStepAccessible(step)) {
      set({ currentStep: Math.max(1, Math.min(4, step)) });
    }
  },
  
  updateUserInfo: (info) => {
    set((state) => ({
      data: { ...state.data, ...info }
    }));
  },
  
  updateCompanyDetails: (details) => {
    set((state) => ({
      data: { ...state.data, ...details }
    }));
  },
  
  updatePersonalization: (personalization) => {
    set((state) => ({
      data: { ...state.data, ...personalization }
    }));
  },
  
  nextStep: () => {
    const { currentStep, isStepAccessible } = get();
    const nextStepNumber = currentStep + 1;
    if (nextStepNumber <= 4 && isStepAccessible(nextStepNumber)) {
      set({ currentStep: nextStepNumber });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  completeOnboarding: () => {
    set({ isCompleted: true });
  },
  
  resetOnboarding: () => {
    set({
      currentStep: 1,
      data: initialData,
      isCompleted: false,
      completedSteps: new Set(),
    });
  },
  
  markStepCompleted: (step: number) => {
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step])
    }));
  },
  
  isStepAccessible: (step: number) => {
    const { completedSteps } = get();
    // Step 1 is always accessible
    if (step === 1) return true;
    // For other steps, the previous step must be completed
    return completedSteps.has(step - 1);
  },
})); 