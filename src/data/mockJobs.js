// Mock Job Data
export const mockJobs = [
    {
        jobId: "job1",
        recruiterId: "rec123",
        companyName: "TechNova Corp",
        role: "Senior Backend Developer",
        jobType: "Full-time",
        experienceRequired: "5+ years",
        location: "Remote",
        salaryRange: "$120k - $150k",
        requiredSkills: ["Java", "Spring Boot", "MongoDB"],
        niceToHave: ["Kafka", "AWS"],
        description: "We are looking for an experienced Senior Backend Developer to lead the architecture and implementation of our microservices.",
        status: "Open",
        createdAt: "2026-03-01"
    },
    {
        jobId: "job2",
        recruiterId: "rec123",
        companyName: "Innovate Solutions",
        role: "Frontend React Developer",
        jobType: "Full-time",
        experienceRequired: "3+ years",
        location: "Hyderabad",
        salaryRange: "₹18L - ₹25L",
        requiredSkills: ["React", "TypeScript", "Redux"],
        niceToHave: ["Next.js"],
        description: "Join our fast-paced frontend team to build highly interactive and performant user interfaces for our latest SaaS product.",
        status: "Open",
        createdAt: "2026-03-02"
    },
    {
        jobId: "job3",
        recruiterId: "rec123",
        companyName: "CloudScale Inc",
        role: "DevOps Engineer",
        jobType: "Contract",
        experienceRequired: "4+ years",
        location: "Bangalore",
        salaryRange: "₹20L - ₹30L",
        requiredSkills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
        niceToHave: ["Terraform", "Prometheus"],
        description: "Looking for a DevOps engineer who can help us transition our legacy infrastructure to a scalable cloud-native Kubernetes environment.",
        status: "Open",
        createdAt: "2026-03-03"
    },
    {
        jobId: "job4",
        recruiterId: "rec123",
        companyName: "DataFlow Systems",
        role: "Data Engineer",
        jobType: "Full-time",
        experienceRequired: "3+ years",
        location: "Remote",
        salaryRange: "$100k - $130k",
        requiredSkills: ["Python", "Spark", "Airflow"],
        niceToHave: ["dbt", "Snowflake"],
        description: "Help build our next-generation data pipelines and analytics warehouse. You will be working with massive datasets in real-time.",
        status: "Closed",
        createdAt: "2026-02-15"
    },
    {
        jobId: "job5",
        recruiterId: "rec123",
        companyName: "AI Research Labs",
        role: "Machine Learning Engineer",
        jobType: "Full-time",
        experienceRequired: "2+ years",
        location: "Pune",
        salaryRange: "₹15L - ₹22L",
        requiredSkills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
        niceToHave: ["MLflow", "ONNX"],
        description: "Join our core AI team to develop and deploy cutting-edge computer vision and NLP models into production at scale.",
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
