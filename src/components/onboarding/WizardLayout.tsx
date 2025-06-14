import { useOnboardingStore } from '@/store/useOnboardingStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WelcomeStep } from './WelcomeStep';
import { CompanyStep } from './CompanyStep';
import { PersonalizationStep } from './PersonalizationStep';
import { Summary } from './Summary';

const STEPS = [
  { number: 1, title: 'Welcome', description: 'Personal info' },
  { number: 2, title: 'Company', description: 'Business details' },
  { number: 3, title: 'Personalize', description: 'Your preferences' },
  { number: 4, title: 'Summary', description: 'Review & complete' },
] as const;

export function WizardLayout() {
  const { currentStep, nextStep, previousStep, setCurrentStep } = useOnboardingStore();

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return <CompanyStep onNext={nextStep} onPrevious={previousStep} />;
      case 3:
        return <PersonalizationStep onNext={nextStep} onPrevious={previousStep} />;
      case 4:
        return <Summary onPrevious={previousStep} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Our Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's set up your account in just a few simple steps
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep} of {STEPS.length}
              </span>
              <Badge variant="outline">
                {STEPS[currentStep - 1]?.title}
              </Badge>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <div 
                key={step.number}
                className="flex flex-col items-center space-y-2"
              >
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground border-primary'
                      : currentStep === step.number
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  data-testid={`step-${step.number}-indicator`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </button>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    currentStep >= step.number 
                      ? 'text-primary' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            <a href="#" className="text-primary hover:underline">
              Vibe with Spilno
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 