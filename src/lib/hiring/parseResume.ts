import {
  createEducationEntry,
  createEmptyEmployer,
  createEmptySocialLink,
  profileUid,
  type CandidateEditProfile,
} from "./candidateProfile";

export type ParsedResumePatch = Partial<
  Pick<
    CandidateEditProfile,
    | "firstName"
    | "middleName"
    | "lastName"
    | "email"
    | "mobile"
    | "skills"
    | "education"
    | "employers"
    | "socialLinks"
  >
>;

/** Simulated CV parse — prefills profile fields for demo */
export async function parseResumeFile(_fileName: string): Promise<ParsedResumePatch> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return {
    firstName: "Alex",
    middleName: "Jordan",
    lastName: "Morgan",
    email: "alex.morgan@email.com",
    mobile: "+49 170 555 0192",
    skills: ["Figma", "Design systems", "User research", "Prototyping"],
    education: [
      createEducationEntry("Master's", {
        required: false,
        isHighest: true,
        seed: {
          institution: "UdK Berlin",
          place: "Berlin, DE",
          yearOfPassing: "2018",
          grade: "1.4",
        },
      }),
      createEducationEntry("Bachelors", {
        required: true,
        seed: {
          institution: "National Institute of Design",
          place: "Ahmedabad, IN",
          yearOfPassing: "2016",
          grade: "8.6 CGPA",
        },
      }),
      createEducationEntry("12th", { required: true, seed: { institution: "Delhi Public School", yearOfPassing: "2012", grade: "92%" } }),
      createEducationEntry("10th", { required: true, seed: { institution: "Delhi Public School", yearOfPassing: "2010", grade: "90%" } }),
    ],
    employers: [
      {
        id: profileUid(),
        designation: "Senior Product Designer",
        company: "Northwind Systems",
        fromDate: "2021-03",
        toDate: "",
        current: true,
        summary: "Led design system adoption across 3 product squads; shipped recruiter workflows used by 40+ teams.",
      },
      {
        id: profileUid(),
        designation: "Product Designer",
        company: "Studio Lattice",
        fromDate: "2018-06",
        toDate: "2021-02",
        current: false,
        summary: "Owned end-to-end flows for B2B analytics dashboards.",
      },
    ],
    socialLinks: [
      { id: profileUid(), label: "LinkedIn", url: "https://linkedin.com/in/alex-morgan" },
      { id: profileUid(), label: "Portfolio", url: "https://alexmorgan.design" },
      { id: profileUid(), label: "GitHub", url: "https://github.com/alexmorgan" },
    ],
  };
}

export function mergeParsedResume(
  profile: CandidateEditProfile,
  patch: ParsedResumePatch,
): CandidateEditProfile {
  return {
    ...profile,
    ...patch,
    education: patch.education ?? profile.education,
    employers: patch.employers ?? profile.employers,
    socialLinks: patch.socialLinks ?? profile.socialLinks,
    skills: patch.skills ?? profile.skills,
  };
}
