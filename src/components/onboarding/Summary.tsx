import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePermitApplicationStore } from '@/store/useOnboardingStore';
import { CheckCircle, Building, MapPin, Factory, Zap, Shield, FileCheck, Bell } from 'lucide-react';

interface SummaryProps {
  onPrevious: () => void;
}

export function Summary({ onPrevious }: SummaryProps) {
  const { data, completeApplication, resetApplication } = usePermitApplicationStore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleComplete = () => {
    completeApplication();
    setShowSuccessDialog(true);
  };

  const handleStartOver = () => {
    resetApplication();
    setShowSuccessDialog(false);
  };


  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Application Summary 📋</CardTitle>
          <CardDescription>
            Review your Federal Operating Permit application before submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Facility Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Facility Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Facility Name</p>
                <p className="font-medium">{data.facilityName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operator Name</p>
                <p className="font-medium">{data.operatorName}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {data.facilityAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">County</p>
                <p className="font-medium">{data.county}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coordinates</p>
                <p className="font-medium">{data.latitude}, {data.longitude}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry Type</p>
                <Badge variant="secondary">{data.industryType.replace('_', ' ')}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RN Number</p>
                <p className="font-medium">{data.regulatedEntityNumber}</p>
              </div>
            </div>
          </div>

          {/* Emission Units */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Factory className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Emission Units & Operations</h3>
            </div>
            <div className="pl-7 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Primary Operations</p>
                <p className="font-medium">{data.primaryOperations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Annual Emissions</p>
                <p className="font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  {data.estimatedAnnualEmissions}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emission Units ({data.emissionUnits.length})</p>
                <div className="space-y-2 mt-2">
                  {data.emissionUnits.map((unit, index) => (
                    <div key={unit.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Unit {index + 1}: {unit.unitType.replace('_', ' ')}</span>
                        <Badge variant="outline">{unit.pollutants.length} pollutants</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>
                      {unit.controlDevice && (
                        <p className="text-sm text-blue-600">Control: {unit.controlDevice}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.hasVOCStorage && <Badge variant="outline">VOC Storage</Badge>}
                {data.hasParticulates && <Badge variant="outline">Particulates</Badge>}
                {data.hasCombustionSources && <Badge variant="outline">Combustion Sources</Badge>}
              </div>
            </div>
          </div>

          {/* Compliance Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Compliance & Monitoring</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Method</p>
                <p className="font-medium">{data.complianceMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monitoring Requirements</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.monitoringRequirements.map((req) => (
                    <Badge key={req} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-2">
                {data.subjectToNSR && <Badge variant="secondary">Subject to NSR</Badge>}
                {data.hasRiskManagementPlan && <Badge variant="secondary">Risk Management Plan</Badge>}
                {data.stratosphericOzoneCompliance && <Badge variant="secondary">Ozone Compliance</Badge>}
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Additional Requirements</h3>
            </div>
            <div className="pl-7 flex flex-wrap gap-2">
              {data.emissionCreditsUsed && <Badge variant="outline">Emission Credits Used</Badge>}
              {data.volatileOrganicCompounds && <Badge variant="outline">VOC Requirements</Badge>}
              {data.subscribeToUpdates && (
                <Badge variant="outline" className="flex items-center">
                  <Bell className="h-3 w-3 mr-1" />
                  Regulatory Updates
                </Badge>
              )}
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your permit application is complete and ready for submission to TCEQ.
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
              data-testid="submit-application-button"
            >
              Submit Application 🚀
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Application Submitted! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Your Federal Operating Permit application has been successfully submitted to TCEQ for review.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 mt-4">
            <Button 
              size="lg" 
              onClick={() => setShowSuccessDialog(false)}
              data-testid="track-application-button"
            >
              Track Application Status
            </Button>
            <Button 
              variant="outline" 
              onClick={handleStartOver}
              data-testid="new-application-button"
            >
              Submit New Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 