import { create } from 'zustand';

export interface EmissionUnit {
  id: string;
  unitType: 'storage_tank' | 'combustion_source' | 'process_vent' | 'fugitive' | 'other';
  description: string;
  pollutants: string[];
  controlDevice?: string;
}

export interface PermitApplicationData {
  // Step 1: Facility Information
  facilityName: string;
  operatorName: string;
  facilityAddress: string;
  county: string;
  latitude: string;
  longitude: string;
  regulatedEntityNumber: string;
  industryType: 'petrochemical' | 'manufacturing' | 'power_generation' | 'refining' | 'chemical' | 'other' | '';
  
  // Step 2: Emission Units & Operations
  primaryOperations: string;
  emissionUnits: EmissionUnit[];
  hasVOCStorage: boolean;
  hasParticulates: boolean;
  hasCombustionSources: boolean;
  estimatedAnnualEmissions: string;
  
  // Step 3: Compliance & Monitoring
  subjectToNSR: boolean;
  hasRiskManagementPlan: boolean;
  monitoringRequirements: string[];
  complianceMethod: 'continuous' | 'periodic' | 'predictive' | 'parametric' | '';
  stratosphericOzoneCompliance: boolean;
  
  // Step 4: Additional Requirements
  emissionCreditsUsed: boolean;
  volatileOrganicCompounds: boolean;
  subscribeToUpdates: boolean;
}

export interface PermitApplicationState {
  currentStep: number;
  data: PermitApplicationData;
  isCompleted: boolean;
  completedSteps: Set<number>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFacilityInfo: (info: Partial<Pick<PermitApplicationData, 
    'facilityName' | 'operatorName' | 'facilityAddress' | 'county' | 
    'latitude' | 'longitude' | 'regulatedEntityNumber' | 'industryType'>>) => void;
  updateEmissionUnits: (units: Partial<Pick<PermitApplicationData,
    'primaryOperations' | 'emissionUnits' | 'hasVOCStorage' | 
    'hasParticulates' | 'hasCombustionSources' | 'estimatedAnnualEmissions'>>) => void;
  updateComplianceInfo: (compliance: Partial<Pick<PermitApplicationData,
    'subjectToNSR' | 'hasRiskManagementPlan' | 'monitoringRequirements' | 
    'complianceMethod' | 'stratosphericOzoneCompliance'>>) => void;
  updateAdditionalRequirements: (requirements: Partial<Pick<PermitApplicationData,
    'emissionCreditsUsed' | 'volatileOrganicCompounds' | 'subscribeToUpdates'>>) => void;
  addEmissionUnit: (unit: EmissionUnit) => void;
  removeEmissionUnit: (id: string) => void;
  updateEmissionUnit: (id: string, updates: Partial<EmissionUnit>) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeApplication: () => void;
  resetApplication: () => void;
  markStepCompleted: (step: number) => void;
  isStepAccessible: (step: number) => boolean;
}

const initialData: PermitApplicationData = {
  // Step 1
  facilityName: '',
  operatorName: '',
  facilityAddress: '',
  county: '',
  latitude: '',
  longitude: '',
  regulatedEntityNumber: '',
  industryType: '',
  
  // Step 2
  primaryOperations: '',
  emissionUnits: [],
  hasVOCStorage: false,
  hasParticulates: false,
  hasCombustionSources: false,
  estimatedAnnualEmissions: '',
  
  // Step 3
  subjectToNSR: false,
  hasRiskManagementPlan: false,
  monitoringRequirements: [],
  complianceMethod: '',
  stratosphericOzoneCompliance: false,
  
  // Step 4
  emissionCreditsUsed: false,
  volatileOrganicCompounds: false,
  subscribeToUpdates: false,
};

export const usePermitApplicationStore = create<PermitApplicationState>((set, get) => ({
  currentStep: 1,
  data: initialData,
  isCompleted: false,
  completedSteps: new Set(),
  
  setCurrentStep: (step: number) => {
    const { isStepAccessible } = get();
    if (isStepAccessible(step)) {
      set({ currentStep: Math.max(1, Math.min(4, step)) });
    }
  },
  
  updateFacilityInfo: (info) => {
    set((state) => ({
      data: { ...state.data, ...info }
    }));
  },
  
  updateEmissionUnits: (units) => {
    set((state) => ({
      data: { ...state.data, ...units }
    }));
  },
  
  updateComplianceInfo: (compliance) => {
    set((state) => ({
      data: { ...state.data, ...compliance }
    }));
  },
  
  updateAdditionalRequirements: (requirements) => {
    set((state) => ({
      data: { ...state.data, ...requirements }
    }));
  },
  
  addEmissionUnit: (unit) => {
    set((state) => ({
      data: {
        ...state.data,
        emissionUnits: [...state.data.emissionUnits, unit]
      }
    }));
  },
  
  removeEmissionUnit: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        emissionUnits: state.data.emissionUnits.filter(unit => unit.id !== id)
      }
    }));
  },
  
  updateEmissionUnit: (id, updates) => {
    set((state) => ({
      data: {
        ...state.data,
        emissionUnits: state.data.emissionUnits.map(unit =>
          unit.id === id ? { ...unit, ...updates } : unit
        )
      }
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
  
  completeApplication: () => {
    set({ isCompleted: true });
  },
  
  resetApplication: () => {
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
    if (step === 1) return true;
    return completedSteps.has(step - 1);
  },
}));