import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  MoreVertical,
  Filter,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import CreatableSelect from "react-select/creatable";
import { apiService, Applicant, Job, Sector } from "@/Api/ApiService";

const experienceTypes = ["Freshers", "Experienced", "All"];

const TempFile = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [isNewJob, setIsNewJob] = useState(false);
  const [activeSector, setActiveSector] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if the admin is logged in
        const token = apiService.getAuthToken();
        if (!token) {
          navigate("/admin-login");
          return;
        }

        setLoading(true);

        // Fetch all data in parallel
        const [jobsData, applicantsData, sectorsData] = await Promise.all([
          apiService.fetchJobs(),
          apiService.fetchApplicants(),
          apiService.fetchSectors(),
        ]);

        setJobs(jobsData);
        setApplicants(applicantsData);
        setSectors(sectorsData);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });

        // If unauthorized, redirect to login
        if (error instanceof Error && error.message.includes("401")) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const openNewJobDialog = () => {
    setCurrentJob({
      id: "",
      title: "",
      description: "",
      sector: "",
      type: "",
    });
    setIsNewJob(true);
    setIsDialogOpen(true);
  };

  const openEditJobDialog = (job: Job) => {
    setCurrentJob({ ...job });
    setIsNewJob(false);
    setIsDialogOpen(true);
  };

  const handleJobInputChange = (field: string, value: string) => {
    setCurrentJob((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const saveJob = async () => {
    if (!currentJob) return;

    // Validate form
    if (
      !currentJob.title ||
      !currentJob.description ||
      !currentJob.sector ||
      !currentJob.type
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (isNewJob) {
        // Add new job
        const newJob = await apiService.createJob({
          title: currentJob.title,
          description: currentJob.description,
          sector: currentJob.sector,
          type: currentJob.type,
        });
        setJobs((prev) => [...prev, newJob]);
        toast({
          title: "Success",
          description: "Job added successfully",
        });
      } else {
        // Update existing job
        const updatedJob = await apiService.updateJob(
          currentJob.id,
          currentJob
        );
        console.log("current job id:", currentJob.id);
        setJobs((prev) =>
          prev.map((job) => (job.id === currentJob.id ? updatedJob : job))
        );
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save job:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isNewJob ? "create" : "update"
        } job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteJobConfirm = (job: Job) => {
    setCurrentJob(job);
    setIsDeleteConfirmOpen(true);
  };

  const deleteJob = async () => {
    if (!currentJob) return;

    try {
      await apiService.deleteJob(currentJob.id);
      setJobs((prev) => prev.filter((job) => job.id !== currentJob.id));
      setIsDeleteConfirmOpen(false);
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      await apiService.deleteApplicant(id);
      setApplicants((prev) => prev.filter((applicant) => applicant.id !== id));
      toast({
        title: "Success",
        description: "Applicant removed successfully",
      });
    } catch (error) {
      console.error("Failed to delete applicant:", error);
      toast({
        title: "Error",
        description: "Failed to remove applicant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportApplicants = async () => {
    try {
      setExporting(true);
      const blob = await apiService.exportApplicants();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applicants_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Applicants exported successfully",
      });
    } catch (error) {
      console.error("Failed to export applicants:", error);
      toast({
        title: "Error",
        description: "Failed to export applicants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleSectorChange = async (option: any) => {
    if (option && option.__isNew__) {
      try {
        // Create new sector
        const newSector = await apiService.createSector(option.value);
        setSectors((prev) => [...prev, newSector]);
        handleJobInputChange("sector", option.value);
      } catch (error) {
        console.error("Failed to create sector:", error);
        toast({
          title: "Error",
          description: "Failed to create new sector. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      handleJobInputChange("sector", option ? option.value : "");
    }
  };

  // Filter jobs based on active sector and type
  const filteredJobs = jobs.filter((job) => {
    const sectorMatch = activeSector === "all" || job.sector === activeSector;
    const typeMatch = activeType === "all" || job.type === activeType;
    return sectorMatch && typeMatch;
  });

  // Convert sectors to react-select options
  const sectorOptions = sectors.map((sector) => ({
    value: sector.name,
    label: sector.name,
  }));

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f2efe8]">
        <Header />
        <main className="flex-grow container mx-auto py-6 px-4 md:py-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#5d5b54]" />
            <span className="text-lg text-[#5d5b54]">Loading dashboard...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f2efe8]">
      <Header />
      <main className="flex-grow container mx-auto py-6 px-4 md:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5d5b54]">
            Admin Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#5d5b54] text-[#5d5b54] hover:bg-[#e3e0d9]"
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <div className="flex justify-center sm:justify-start mb-6">
            <TabsList className="bg-[#e3e0d9] w-full max-w-md mx-auto sm:mx-0">
              <TabsTrigger
                value="jobs"
                className="flex-1 data-[state=active]:bg-[#5d5b54] data-[state=active]:text-white"
              >
                Manage Jobs ({jobs.length})
              </TabsTrigger>
              <TabsTrigger
                value="applicants"
                className="flex-1 data-[state=active]:bg-[#5d5b54] data-[state=active]:text-white"
              >
                View Applicants ({applicants.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-center sm:text-left">
                      Jobs
                    </CardTitle>
                    <CardDescription className="text-center sm:text-left">
                      Manage job listings across all sectors
                    </CardDescription>
                  </div>
                  <Button
                    className="w-full sm:w-auto bg-[#5d5b54] hover:bg-[#3f3e39]"
                    onClick={openNewJobDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Filter Controls */}
                <div className="flex flex-wrap gap-2 mb-4 md:hidden">
                  <Select value={activeSector} onValueChange={setActiveSector}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={activeType} onValueChange={setActiveType}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {experienceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  {/* Desktop Table */}
                  <table className="w-full border-collapse hidden md:table">
                    <thead>
                      <tr className="bg-[#e3e0d9]">
                        <th className="text-left p-3 border-b">Title</th>
                        <th className="text-left p-3 border-b">Sector</th>
                        <th className="text-left p-3 border-b">Type</th>
                        <th className="text-right p-3 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-gray-500"
                          >
                            No jobs found. Click "Add New Job" to create your
                            first job listing.
                          </td>
                        </tr>
                      ) : (
                        filteredJobs.map((job) => (
                          <tr
                            key={job.id}
                            className="border-b hover:bg-[#f2efe8]"
                          >
                            <td className="p-3">{job.title}</td>
                            <td className="p-3">{job.sector}</td>
                            <td className="p-3">{job.type}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-[#5d5b54]"
                                onClick={() => openEditJobDialog(job)}
                              >
                                <span className="sr-only">Edit</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => openDeleteJobConfirm(job)}
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 px-4">
                    {filteredJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No jobs found. Click "Add New Job" to create your first
                        job listing.
                      </div>
                    ) : (
                      filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className="bg-white p-4 rounded-lg border shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                <Badge
                                  variant="outline"
                                  className="bg-[#e3e0d9]"
                                >
                                  {job.sector}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-[#e3e0d9]"
                                >
                                  {job.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                {job.description}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openEditJobDialog(job)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteJobConfirm(job)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicants">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-center sm:text-left">
                      Applicants
                    </CardTitle>
                    <CardDescription className="text-center sm:text-left">
                      View and manage all job applications
                    </CardDescription>
                  </div>
                  <Button
                    className="w-full sm:w-auto bg-[#5d5b54] hover:bg-[#3f3e39]"
                    onClick={handleExportApplicants}
                    disabled={exporting || applicants.length === 0}
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  {/* Desktop Table */}
                  <table className="w-full border-collapse hidden md:table">
                    <thead>
                      <tr className="bg-[#e3e0d9]">
                        <th className="text-left p-3 border-b">Name</th>
                        <th className="text-left p-3 border-b">Email</th>
                        <th className="text-left p-3 border-b">Phone</th>
                        <th className="text-left p-3 border-b">Sector</th>
                        <th className="text-left p-3 border-b">Job Title</th>
                        <th className="text-left p-3 border-b">Experience</th>
                        <th className="text-center p-3 border-b">Resume</th>
                        <th className="text-right p-3 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-8 text-center text-gray-500"
                          >
                            No applicants found.
                          </td>
                        </tr>
                      ) : (
                        applicants.map((applicant) => (
                          <tr
                            key={applicant.id}
                            className="border-b hover:bg-[#f2efe8]"
                          >
                            <td className="p-3">{applicant.name}</td>
                            <td className="p-3">{applicant.email}</td>
                            <td className="p-3">{applicant.phone}</td>
                            <td className="p-3">{applicant.sector}</td>
                            <td className="p-3">{applicant.jobTitle}</td>
                            <td className="p-3">{applicant.experienceLevel}</td>
                            <td className="p-3 text-center">
                              <a
                                href={applicant.resumeURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#5d5b54] hover:text-[#3f3e39] underline"
                              >
                                Download
                              </a>
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => deleteApplicant(applicant.id)}
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 px-4">
                    {applicants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No applicants found.
                      </div>
                    ) : (
                      applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="bg-white p-4 rounded-lg border shadow-sm"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{applicant.name}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <a
                                    href={applicant.resumeURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="mr-2 h-4 w-4" /> Resume
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => deleteApplicant(applicant.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-1 gap-1 mt-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium w-24">Email:</span>
                              <span className="text-muted-foreground">
                                {applicant.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium w-24">Phone:</span>
                              <span className="text-muted-foreground">
                                {applicant.phone}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium w-24">Sector:</span>
                              <span className="text-muted-foreground">
                                {applicant.sector}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium w-24">Job:</span>
                              <span className="text-muted-foreground">
                                {applicant.jobTitle}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium w-24">
                                Experience:
                              </span>
                              <span className="text-muted-foreground">
                                {applicant.experienceLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Add/Edit Job Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewJob ? "Add New Job" : "Edit Job"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={currentJob?.title || ""}
                onChange={(e) => handleJobInputChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentJob?.description || ""}
                onChange={(e) =>
                  handleJobInputChange("description", e.target.value)
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sector">Sector</Label>
              <CreatableSelect
                id="sector"
                isClearable
                placeholder="Select or type sector"
                value={
                  currentJob?.sector
                    ? { value: currentJob.sector, label: currentJob.sector }
                    : null
                }
                onChange={handleSectorChange}
                options={sectorOptions}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={currentJob?.type || ""}
                onValueChange={(value) => handleJobInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {experienceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={saveJob}
              className="w-full sm:w-auto order-1 sm:order-2 bg-[#5d5b54] hover:bg-[#3f3e39]"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Job Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the job "{currentJob?.title}"?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteJob}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TempFile;
