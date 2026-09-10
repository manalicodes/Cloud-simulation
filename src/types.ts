/**
 * Core type definitions for CloudExec Techno-Management Tutor & Comparison Engine
 */

export type NavigationTab = 
  | 'tutor' 
  | 'comparison' 
  | 'finops-lab' 
  | 'shared-responsibility' 
  | 'capstone';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'curated_engine' | 'fallback_engine';
  dilemmaOptions?: {
    id: string;
    label: string;
    description: string;
    promptText: string;
  }[];
}

export interface ComparisonDimension {
  dimension: string;
  optionA: string;
  optionB: string;
  strategicTradeoff: string;
}

export interface ComparisonResult {
  title: string;
  optionAName: string;
  optionBName: string;
  dimensions: ComparisonDimension[];
  pillars: {
    technicalMechanics: string;
    businessEconomics: string;
    operationalGovernance: string;
  };
  executiveRecommendation: string;
}

export interface ModuleLesson {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  concepts: string[];
  keyQuestion: string;
  presetComparison: {
    optionA: string;
    optionB: string;
  };
  executiveDilemma: {
    scenario: string;
    options: {
      id: string;
      label: string;
      impact: string;
      prompt: string;
    }[];
  };
}

export type SevenRStrategy = 
  | 'Rehost'
  | 'Replatform'
  | 'Refactor'
  | 'Repurchase'
  | 'Retain'
  | 'Retire'
  | 'Relocate';

export interface WorkloadProfile {
  id: string;
  name: string;
  currentTech: string;
  characteristics: string;
  businessPriority: 'Critical' | 'High' | 'Medium' | 'Low';
  annualRunCost: number; // in $k
  selectedStrategy: SevenRStrategy;
  strategyRationale: string;
}

export type CloudModel = 'on-prem' | 'iaas' | 'paas' | 'saas' | 'serverless';

export type ResponsibilityOwner = 'customer' | 'shared' | 'provider';

export interface StackLayer {
  id: string;
  name: string;
  description: string;
  ownership: Record<CloudModel, ResponsibilityOwner>;
  keyThreats: string;
}
