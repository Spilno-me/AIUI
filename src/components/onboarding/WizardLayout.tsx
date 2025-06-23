import { useOnboardingStore } from '@/store/useOnboardingStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WelcomeStep } from './WelcomeStep';
import { CompanyStep } from './CompanyStep';
import { Summary } from './Summary';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { useWebSocket } from '@/hooks/useWebSocket';

const STEPS = [
  { number: 1, title: 'Welcome', description: 'Personal info' },
  { number: 2, title: 'Company', description: 'Business details' },
  { number: 3, title: 'Summary', description: 'Review & complete' },
] as const;

export function WizardLayout() {
  const { currentStep, nextStep, previousStep, setCurrentStep, isStepAccessible } = useOnboardingStore();
  const { suggestions, removeSuggestion, handleWebSocketMessage } = useAISuggestions();
  
  // Connect to WebSocket server
  const { isConnected } = useWebSocket({
    url: 'ws://localhost:8765',
    onMessage: handleWebSocketMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (error) => console.error('WebSocket error:', error)
  });
  
  // Handler for accepting suggestions
  const handleAcceptSuggestion = (fieldName: string, _value: any) => {
    // Remove the suggestion from state after accepting
    removeSuggestion(fieldName);
  };
  
  // Handler for rejecting suggestions
  const handleRejectSuggestion = (fieldName: string) => {
    removeSuggestion(fieldName);
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep 
            onNext={nextStep}
            suggestions={suggestions}
            onAcceptSuggestion={handleAcceptSuggestion}
            onRejectSuggestion={handleRejectSuggestion}
          />
        );
      case 2:
        return (
          <CompanyStep 
            onNext={nextStep} 
            onPrevious={previousStep}
            suggestions={suggestions}
            onAcceptSuggestion={handleAcceptSuggestion}
            onRejectSuggestion={handleRejectSuggestion}
          />
        );
      case 3:
        return <Summary onPrevious={previousStep} />;
      default:
        return (
          <WelcomeStep 
            onNext={nextStep}
            suggestions={suggestions}
            onAcceptSuggestion={handleAcceptSuggestion}
            onRejectSuggestion={handleRejectSuggestion}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to AIUI
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's vibe!
          </p>
          {/* WebSocket connection status */}
          <div className="mt-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? "AI Assistant Connected" : "AI Assistant Disconnected"}
            </Badge>
          </div>
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
                  onClick={() => {
                    if (isStepAccessible(step.number)) {
                      setCurrentStep(step.number);
                    }
                  }}
                  disabled={!isStepAccessible(step.number)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all shadow-lg backdrop-blur-sm ${
                    !isStepAccessible(step.number)
                      ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                      : currentStep >= step.number
                      ? 'bg-primary text-primary-foreground border-primary shadow-primary/25 ring-2 ring-primary/20 cursor-pointer hover:shadow-xl'
                      : currentStep === step.number
                      ? 'border-primary text-primary bg-white/80 dark:bg-gray-800/80 shadow-primary/20 ring-2 ring-primary/30 cursor-pointer'
                      : 'border-white/40 dark:border-white/20 text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 hover:border-white/60 dark:hover:border-white/30 hover:shadow-xl cursor-pointer'
                  }`}
                  data-testid={`step-${step.number}-indicator`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </button>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    !isStepAccessible(step.number)
                      ? 'text-gray-400 dark:text-gray-500'
                      : currentStep >= step.number 
                      ? 'text-primary' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs hidden sm:block ${
                    !isStepAccessible(step.number)
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
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