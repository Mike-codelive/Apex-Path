export type WorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
};

export type Education = {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
};

export type ProfileFormValues = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: WorkExperience[];
  education: Education;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
  resumePdfUrl: string;
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
};

export type ProfileActionState = {
  success: boolean;
  message: string;
  completionPercentage?: number;
  missingFields?: string[];
};

export type ResumeActionState = {
  success: boolean;
  message: string;
  resumeDownloadUrl?: string;
};

export type ProfileExtractedValues = Pick<
  ProfileFormValues,
  | "fullName"
  | "phone"
  | "location"
  | "linkedinUrl"
  | "portfolioUrl"
  | "currentTitle"
  | "experienceLevel"
  | "yearsExperience"
  | "skills"
  | "industries"
  | "workExperience"
  | "education"
>;

export type ProfileExtractionErrorCode =
  | "invalid_pdf"
  | "unreadable_pdf"
  | "extraction_failed";

export type ProfileExtractionResult =
  | {
      success: true;
      data: ProfileExtractedValues;
    }
  | {
      success: false;
      code: ProfileExtractionErrorCode;
    };

export type ProfileExtractionApiResponse =
  | {
      success: true;
      data: ProfileExtractedValues;
    }
  | {
      success: false;
      error: string;
    };

export type ProfileCompletionInput = Pick<
  ProfileFormValues,
  | "fullName"
  | "phone"
  | "location"
  | "currentTitle"
  | "experienceLevel"
  | "skills"
  | "workExperience"
  | "education"
  | "jobTitlesSeeking"
  | "remotePreference"
>;

export type ProfileCompletion = {
  isComplete: boolean;
  percentage: number;
  missingFields: string[];
};
