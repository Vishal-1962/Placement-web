// src/utils/eligibility.js

export const checkEligibility = (profile, company) => {
  // If we don't have the student's 10th/12th data yet,
  // we'll be cautious and say false.
  if (!profile.tenthPercent || !profile.twelfthPercent) {
    return false;
  }

  // Check 1: SGPA
  if (profile.sgpa < company.min_sgpa) {
    return false;
  }

  // Check 2: 10th Percent
  if (profile.tenthPercent < company.min_tenthPercent) {
    return false;
  }
  
  // Check 3: 12th Percent
  if (profile.twelfthPercent < company.min_twelfthPercent) {
    return false;
  }

  // Check 4: Backlogs
  if (profile.activeBacklogs > company.allowedBacklogs) {
    return false;
  }

  // Check 5: Department
  // We check if the company's "allowedDepts" array
  // includes the student's "department"
  if (!company.allowedDepts.includes(profile.department)) {
    return false;
  }

  // If all checks passed, the student is eligible!
  return true;
};