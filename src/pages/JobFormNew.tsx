import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/Api/ApiService";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo_dye"></div>
  </div>
);

// Format sector name for display
const formatSectorName = (sector) => {
  return sector
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const JobFormNew = () => {
  const { sector } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "Freshers",
    yearsExperience: "",
    jobTitle: "",
    resume: null,
  });

  const [allJobs, setAllJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  // Fetch all jobs from API
  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError(null);

      const jobs = await apiService.fetchJobs();
      setAllJobs(jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobsError("Failed to load available jobs. Please try again.");
      setAllJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // Initial jobs fetch
  useEffect(() => {
    fetchJobs();
    console.log(allJobs);
  }, []);

  // Filter jobs based on current sector
  useEffect(() => {
    if (sector && allJobs.length > 0) {
      const sectorJobs = allJobs.filter(
        (job) => job.sector === formatSectorName(sector)
      );
      setAvailableJobs(sectorJobs);

      // Reset job title when sector changes
      setFormData((prev) => ({ ...prev, jobTitle: "" }));
      setSelectedJobType("");
    } else {
      setAvailableJobs([]);
    }
  }, [sector, allJobs]);

  // Handle job title selection and auto-set experience level
  useEffect(() => {
    if (formData.jobTitle) {
      const selectedJob = availableJobs.find(
        (job) => job.title === formData.jobTitle
      );
      if (selectedJob) {
        setSelectedJobType(selectedJob.type);

        // If the job is specifically for Freshers or Experienced, set the experience level accordingly
        if (
          selectedJob.type === "Freshers" ||
          selectedJob.type === "Experienced"
        ) {
          setFormData((prev) => ({
            ...prev,
            experienceLevel: selectedJob.type,
          }));
        }
      }
    }
  }, [formData.jobTitle, availableJobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleRetryJobs = () => {
    fetchJobs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.resume) {
      toast({
        title: "Missing resume",
        description: "Please upload your resume to apply.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobTitle) {
      toast({
        title: "Missing job title",
        description: "Pleaho tohse select a job title to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // This would be implemented with actual API calls
      // First, upload the resume file

      const formDataForUpload = new FormData();
      formDataForUpload.append("file", formData.resume);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataForUpload,
      });

      const { fileUrl } = await uploadResponse.json();

      // Then submit the application with the resume URL
      const applicationResponse = await fetch("/api/applicants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          resumeURL: fileUrl,
          sector: sector,
        }),
      });

      if (!applicationResponse.ok) {
        throw new Error("Failed to submit application");
      }

      // For demo, we'll simulate success
      setTimeout(() => {
        toast({
          title: "Application Submitted!",
          description:
            "Your application has been successfully submitted. We'll be in touch soon.",
        });
        navigate(`/thankyou/${sector}`);
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gunmetal mb-6">
            Apply for {sector ? formatSectorName(sector) : "Job"}
          </h1>

          <form onSubmit={handleSubmit}>
            <FormField label="Job Title" id="jobTitle" required>
              {jobsLoading ? (
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600">Loading jobs...</span>
                </div>
              ) : jobsError ? (
                <div className="w-full p-3 border border-red-300 rounded-md bg-red-50">
                  <p className="text-red-600 text-sm mb-2">{jobsError}</p>
                  <button
                    type="button"
                    onClick={handleRetryJobs}
                    className="text-red-700 underline text-sm hover:no-underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <select
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
                  disabled={availableJobs.length === 0}
                >
                  <option value="">
                    {availableJobs.length === 0
                      ? `-- No jobs available for ${formatSectorName(
                          sector || ""
                        )} --`
                      : "-- Select Job Title --"}
                  </option>
                  {availableJobs.map((job) => (
                    <option key={job.id} value={job.title}>
                      {job.title} ({job.type})
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Full Name" id="name" required>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
            </FormField>

            <FormField label="Email" id="email" required>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
            </FormField>

            <FormField label="Phone Number" id="phone" required>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
            </FormField>

            {selectedJobType !== "All" ? (
              <FormField
                label={`Experience Level: ${selectedJobType}`}
                id="experienceLevel"
              >
                <input
                  type="text"
                  id="experienceLevel"
                  value={selectedJobType}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </FormField>
            ) : (
              <FormField label="Experience Level" id="experienceLevel" required>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
                >
                  <option value="Freshers">Freshers</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </FormField>
            )}

            {(formData.experienceLevel === "Experienced" ||
              selectedJobType === "Experienced") && (
              <FormField
                label="Years of Experience"
                id="yearsExperience"
                required
              >
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  min="0"
                  step="0.5"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
                />
              </FormField>
            )}

            <FormField label="Resume" id="resume">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo_dye-400"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX
              </p>
            </FormField>

            <div className="mt-8">
              <Button
                type="submit"
                disabled={
                  isSubmitting || jobsLoading || availableJobs.length === 0
                }
                className="w-full bg-indigo_dye hover:bg-indigo_dye-600 text-white py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobFormNew;
