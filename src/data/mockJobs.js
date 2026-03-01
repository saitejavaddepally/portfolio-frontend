// Mock Job Data
export const mockJobs = [
    {
        jobId: "job1",
        recruiterId: "rec123",
        role: "Senior Backend Developer",
        experienceRequired: "5+ years",
        location: "Remote",
        requiredSkills: ["Java", "Spring Boot", "MongoDB"],
        niceToHave: ["Kafka", "AWS"],
        status: "Open",
        createdAt: "2026-03-01"
    },
    {
        jobId: "job2",
        recruiterId: "rec123",
        role: "Frontend React Developer",
        experienceRequired: "3+ years",
        location: "Hyderabad",
        requiredSkills: ["React", "TypeScript", "Redux"],
        niceToHave: ["Next.js"],
        status: "Open",
        createdAt: "2026-03-02"
    },
    {
        jobId: "job3",
        recruiterId: "rec123",
        role: "DevOps Engineer",
        experienceRequired: "4+ years",
        location: "Bangalore",
        requiredSkills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
        niceToHave: ["Terraform", "Prometheus"],
        status: "Open",
        createdAt: "2026-03-03"
    },
    {
        jobId: "job4",
        recruiterId: "rec123",
        role: "Data Engineer",
        experienceRequired: "3+ years",
        location: "Remote",
        requiredSkills: ["Python", "Spark", "Airflow"],
        niceToHave: ["dbt", "Snowflake"],
        status: "Closed",
        createdAt: "2026-02-15"
    },
    {
        jobId: "job5",
        recruiterId: "rec123",
        role: "Machine Learning Engineer",
        experienceRequired: "2+ years",
        location: "Pune",
        requiredSkills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
        niceToHave: ["MLflow", "ONNX"],
        status: "Open",
        createdAt: "2026-03-01"
    }
];

// Mock Candidate Results for semantic search
export const mockCandidates = [
    {
        userId: "user1",
        name: "Rahul Sharma",
        skills: ["Java", "Spring Boot", "MongoDB", "Microservices"],
        experience: "6 years",
        score: 0.89,
        location: "Bangalore"
    },
    {
        userId: "user2",
        name: "Anjali Reddy",
        skills: ["Java", "Microservices", "AWS", "Kafka"],
        experience: "5 years",
        score: 0.76,
        location: "Hyderabad"
    },
    {
        userId: "user3",
        name: "Priya Menon",
        skills: ["React", "TypeScript", "Redux", "Next.js"],
        experience: "4 years",
        score: 0.92,
        location: "Remote"
    },
    {
        userId: "user4",
        name: "Arjun Kapoor",
        skills: ["Python", "Spark", "Airflow", "dbt"],
        experience: "3 years",
        score: 0.68,
        location: "Pune"
    },
    {
        userId: "user5",
        name: "Sneha Patel",
        skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
        experience: "5 years",
        score: 0.84,
        location: "Mumbai"
    }
];
