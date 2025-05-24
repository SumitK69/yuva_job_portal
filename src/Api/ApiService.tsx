// types.ts - Type definitions
export interface Job {
  id: string;
  title: string;
  description: string;
  sector: string;
  type: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  jobTitle: string;
  jobId?: string;
  experienceLevel: string;
  resumeURL: string;
  appliedAt?: string;
}

export interface Sector {
  id: string;
  name: string;
}

// config.ts - Configuration
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// apiService.ts - API Service
class ApiService {
  public getAuthToken(): string | null {
    return localStorage.getItem("adminToken");
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getAuthToken()}`,
    };
  }

  // Jobs API
  async fetchJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch jobs");
    const jobs = await response.json();
    // Map _id to id
    return jobs.map((job: any) => ({
      ...job,
      id: job.id || job._id, // prefer id, fallback to _id
    }));
  }

  async createJob(job: Omit<Job, "_id">): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  }

  async updateJob(id: string, job: Omit<Job, "id">): Promise<Job> {
    // Omit 'id' and '_id' from the request body if present
    const { id: omitId, _id, ...jobWithoutIds } = job as any;
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(jobWithoutIds),
    });
    if (!response.ok) throw new Error("Failed to update job");
    const updated = await response.json();
    return { ...updated, id: updated.id || updated._id };
  }

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete job");
  }

  // Applicants API

  async createApplicant(applicant: Omit<Applicant, "id">): Promise<Applicant> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(applicant),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  }

  async fetchApplicants(): Promise<Applicant[]> {
    const response = await fetch(`${API_BASE_URL}/applicants`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch applicants");
    return response.json();
  }

  async deleteApplicant(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/applicants/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete applicant");
  }

  async exportApplicants(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/applicants/export`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to export applicants");
    return response.blob();
  }

  // Sectors API
  async fetchSectors(): Promise<Sector[]> {
    const response = await fetch(`${API_BASE_URL}/sectors`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch sectors");
    return response.json();
  }

  async createSector(name: string): Promise<Sector> {
    const response = await fetch(`${API_BASE_URL}/sectors`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create sector");
    return response.json();
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export types for convenience
