import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermitApplicationStore } from '@/store/usePermitApplicationStore';
import { additionalRequirementsStepSchema, type AdditionalRequirementsStepData } from '@/lib/validationSchemas';
import { Building2, Factory2, Shield, FileCheck, Bell, MapPin, ClipboardCheck } from 'lucide-react';

interface SummaryProps {
  onPrevious: () => void;
}

export function Summary({ onPrevious }: SummaryProps) {
  const { data, updateAdditionalRequirements, completeApplication, resetApplication, markStepCompleted } = usePermitApplicationStore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<AdditionalRequirementsStepData>({
    resolver: zodResolver(additionalRequirementsStepSchema),
    defaultValues: {
      emissionCreditsUsed: data.emissionCreditsUsed,
      volatileOrganicCompounds: data.volatileOrganicCompounds,
      subscribeToUpdates: data.subscribeToUpdates,
    },
  });

  const handleComplete = (formData: AdditionalRequirementsStepData) => {
    updateAdditionalRequirements(formData);
    markStepCompleted(4);
    completeApplication();
    setShowSuccessDialog(true);
  };

  const handleStartOver = () => {
    resetApplication();
    setShowSuccessDialog(false);
  };

  const industryTypeLabels: Record<string, string> = {
    petrochemical: 'Petrochemical',
    manufacturing: 'Manufacturing',
    power_generation: 'Power Generation',
    refining: 'Refining',
    chemical: 'Chemical',
    other: 'Other',
  };

  const complianceMethodLabels: Record<string, string> = {
    continuous: 'Continuous Monitoring',
    periodic: 'Periodic Testing',
    predictive: 'Predictive Monitoring',
    parametric: 'Parametric Monitoring',
  };

  const monitoringLabels: Record<string, string> = {
    cems: 'CEMS',
    cam: 'CAM',
    periodic: 'Periodic',
    parametric: 'Parametric',
    stack_testing: 'Stack Testing',
    recordkeeping: 'Recordkeeping',
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Application Summary</CardTitle>
          <CardDescription>
            Review your permit application and provide additional requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Facility Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Facility Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Facility Name</p>
                <p className="font-medium">{data.facilityName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operator</p>
                <p className="font-medium">{data.operatorName}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{data.facilityAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">County</p>
                <p className="font-medium">{data.county}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coordinates</p>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {data.latitude}, {data.longitude}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RN Number</p>
                <Badge variant="secondary">{data.regulatedEntityNumber}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <Badge variant="outline">{industryTypeLabels[data.industryType] || data.industryType}</Badge>
              </div>
            </div>
          </div>

          {/* Emission Units */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Factory2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Emission Units & Operations</h3>
            </div>
            <div className="space-y-3 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Primary Operations</p>
                <p className="font-medium text-sm">{data.primaryOperations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emission Units ({data.emissionUnits.length})</p>
                <div className="space-y-2 mt-1">
                  {data.emissionUnits.map((unit, index) => (
                    <div key={unit.id} className="text-sm border-l-2 pl-3">
                      <p className="font-medium">{index + 1}. {unit.description}</p>
                      <p className="text-muted-foreground text-xs">
                        Type: {unit.unitType} | Pollutants: {unit.pollutants.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.hasVOCStorage && <Badge variant="secondary">VOC Storage</Badge>}
                {data.hasParticulates && <Badge variant="secondary">Particulates</Badge>}
                {data.hasCombustionSources && <Badge variant="secondary">Combustion Sources</Badge>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Annual Emissions</p>
                <p className="font-medium">{data.estimatedAnnualEmissions} tons/year</p>
              </div>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Compliance & Monitoring</h3>
            </div>
            <div className="space-y-3 pl-7">
              <div className="flex flex-wrap gap-2">
                {data.subjectToNSR && <Badge variant="destructive">Subject to NSR</Badge>}
                {data.hasRiskManagementPlan && <Badge variant="destructive">RMP Required</Badge>}
                {data.stratosphericOzoneCompliance && <Badge variant="outline">Ozone Compliance</Badge>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monitoring Requirements</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.monitoringRequirements.map(req => (
                    <Badge key={req} variant="secondary" className="text-xs">
                      {monitoringLabels[req] || req}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Method</p>
                <p className="font-medium">{complianceMethodLabels[data.complianceMethod] || data.complianceMethod}</p>
              </div>
            </div>
          </div>

          {/* Additional Requirements Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Additional Requirements
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleComplete)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="emissionCreditsUsed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Emission Reduction Credits (ERCs) will be used
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="volatileOrganicCompounds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Facility is a major source of Volatile Organic Compounds (VOCs)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscribeToUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="subscribeToUpdates"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Subscribe to regulatory updates
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Get notified about changes to air quality regulations and permit requirements
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    By submitting this application, you certify that all information provided is accurate and complete.
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
                    type="submit"
                    size="lg" 
                    data-testid="submit-application-button"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Application Submitted! ✅
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Your Federal Operating Permit application has been successfully submitted to TCEQ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Facility:</strong> {data.facilityName}</p>
              <p><strong>RN Number:</strong> {data.regulatedEntityNumber}</p>
              <p className="mt-2">You will receive a confirmation email with your application details and next steps.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <Button 
                size="lg" 
                onClick={() => setShowSuccessDialog(false)}
                data-testid="close-dialog-button"
              >
                Close
              </Button>
              <Button 
                variant="outline" 
                onClick={handleStartOver}
                data-testid="new-application-button"
              >
                Start New Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}