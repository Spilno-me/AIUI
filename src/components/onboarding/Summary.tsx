import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { CheckCircle, User, Building, Mail, Users, Target, Bell } from 'lucide-react';

interface SummaryProps {
  onPrevious: () => void;
}

export function Summary({ onPrevious }: SummaryProps) {
  const { data, completeOnboarding, resetOnboarding } = useOnboardingStore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleComplete = () => {
    completeOnboarding();
    setShowSuccessDialog(true);
  };

  const handleStartOver = () => {
    resetOnboarding();
    setShowSuccessDialog(false);
  };


  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Almost done! 🎯</CardTitle>
          <CardDescription>
            Review your information below and complete your setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{data.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {data.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <Badge variant="secondary">{data.industry}</Badge>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Company Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{data.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {data.numberOfEmployees} employees
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Goals</p>
                <p className="font-medium flex items-start">
                  <Target className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  {data.goals}
                </p>
              </div>
              {data.subscribeToUpdates && (
                <div className="md:col-span-2">
                  <Badge variant="outline" className="flex items-center w-fit">
                    <Bell className="h-3 w-3 mr-1" />
                    Subscribed to updates
                  </Badge>
                </div>
              )}
            </div>
          </div>


          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your information looks great! We'll use this to personalize your experience.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              onClick={onPrevious}
              data-testid="previous-button"
            >
              ← Previous
            </Button>
            <Button 
              size="lg" 
              onClick={handleComplete}
              data-testid="complete-setup-button"
            >
              Complete Setup 🎉
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              You're all set! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Welcome to the platform, {data.fullName}! Your personalized experience is ready.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 mt-4">
            <Button 
              size="lg" 
              onClick={() => setShowSuccessDialog(false)}
              data-testid="get-started-button"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              onClick={handleStartOver}
              data-testid="start-over-button"
            >
              Start Over
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 