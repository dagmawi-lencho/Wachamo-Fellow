// Wachamo University Academic Data

export const colleges = [
  "Freshman",
  "Engineering & Technology",
  "Natural & Computational Science",
  "Medicine and Health Science",
  "Agricultural Sciences",
  "Business and Economics",
  "Social Science and Humanities",
  "Education & Behavioral Science",
] as const;

// Departments organized by college
export const departmentsByCollege: Record<string, string[]> = {
  "Freshman": [
    "Freshman",
    "Pre-Engineering",
    "Remedial",
    "Other Natural Science",
    "Other Social Science",
  ],
  
  "Engineering & Technology": [
    "BSc. in Architecture",
    "BSc. in Chemical Engineering",
    "BSc. in Civil Engineering",
    "BSc. in Computer Science",
    "BSc. in Construction Technology and Management",
    "BSc. in Electrical and Computer Engineering",
    "BSc. in Electro-Mechanical Engineering",
    "BSc. in Surveying Engineering",
    "BSc. in Information System(IS)",
    "BSc. in Information Technology(IT)",
    "BSc. in Mechanical Engineering",
    "BSc. in Software Engineering",
    "BSc in Hydraulic and Water Resource Engineering",
    "BSc in Biomedical Engineering",
  ],
  
  "Natural & Computational Science": [
    "BSc in Biology",
    "BSc in Chemistry",
    "BSc in Mathematics",
    "BSc in Statistics",
    "BSc in Biotechnology",
    "BSc in Geology",
    "BSc in Sport Science",
    "BSc in Industrial Chemistry",
  ],
  
  "Medicine and Health Science": [
    "BSc in Anesthesia",
    "BSc in Medicine",
    "BSc in Midwifery",
    "BSc in Comprehensive Nursing",
    "BSc in Public Health",
    "BSc in Health Informatics",
    "BSc in Medical Laboratory Technology",
    "BSc in Pharmacy",
    "BSc in Surgical Nursing(PB)",
    "BSc in Paediatrics& Chilled Health Nursing (PB)",
    "BSc in Dental Medicine",
    "Doctor of Veterinary Medicine (DVM)",
    "BSc in Veterinary Science",
  ],
  
  "Agricultural Sciences": [
    "BSc in Animal Science",
    "BSc in Horticulture",
    "BSc in Natural Resource Management",
    "BSc in Plant Science",
    "BSc in Environmental Science",
    "BSc in Food Science and Postharvest Technology",
    "BSc in Agro Economics",
    "BSc in Rural Development & Agricultural Extension",
  ],
  
  "Business and Economics": [
    "BA in Accounting and Finance",
    "BA in Management",
    "BA in Economics",
    "BA in Marketing Management",
    "BA in Public Administration and Development Management",
    "BA in Tourism & Hotel Management",
  ],
  
  "Social Science and Humanities": [
    "BA in Political Science and International Relation",
    "BA in English Language and Literature",
    "BA in Geography and Environmental Studies",
    "BA in Hadiyissa Language & Literature (Main Campus)",
    "BA in Sociology",
    "BA in History & Heritage Management",
    "BA in Governance & Development Studies",
    "BA in Journalism",
    "BA in Kambatisa (Durame Campus)",
    "BA in Psychology",
    "BA in Law (LLB)",
  ],
  
  "Education & Behavioral Science": [
    "Educational Leadership & Management",
    "BA in Educational Leadership and Management",
    "Special Needs and Inclusive Education",
  ],
};

// Get all departments as a flat array
export const allDepartments = Object.values(departmentsByCollege).flat();

// Helper function to get departments for a specific college
export function getDepartmentsByCollege(college: string): string[] {
  return departmentsByCollege[college] || [];
}

