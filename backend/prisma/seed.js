
import prisma from "../config/db.js";

const courses = [
  {
    title: "Python Programming Fundamentals",
    description: "Learn Python basics, variables, loops, functions and object-oriented programming.",
    category: "Programming",
    tags: ["Python", "Programming", "Coding"],
    prerequisites: [],
    difficulty: "BEGINNER",
    duration: 12,
  },
  {
    title: "Full Stack Web Development",
    description: "Build modern web applications using React, Node.js and PostgreSQL.",
    category: "Web Development",
    tags: ["React", "Node.js", "JavaScript", "PostgreSQL"],
    prerequisites: ["HTML", "CSS", "JavaScript"],
    difficulty: "INTERMEDIATE",
    duration: 30,
  },
  {
    title: "Introduction to Artificial Intelligence",
    description: "Explore AI concepts, intelligent systems and practical applications.",
    category: "Artificial Intelligence",
    tags: ["AI", "Machine Learning", "Python"],
    prerequisites: ["Python"],
    difficulty: "BEGINNER",
    duration: 15,
  },
  {
    title: "Machine Learning with Python",
    description: "Understand supervised learning, classification, regression and model evaluation.",
    category: "Machine Learning",
    tags: ["Machine Learning", "Python", "Scikit-learn"],
    prerequisites: ["Python", "Basic Mathematics"],
    difficulty: "INTERMEDIATE",
    duration: 25,
  },
  {
    title: "Cyber Security Fundamentals",
    description: "Learn network security, common cyber threats, vulnerabilities and security principles.",
    category: "Cyber Security",
    tags: ["Cyber Security", "Networking", "Security"],
    prerequisites: [],
    difficulty: "BEGINNER",
    duration: 18,
  },
  {
    title: "Ethical Hacking and Penetration Testing",
    description: "Study authorized security assessments, reconnaissance, vulnerability analysis and penetration testing.",
    category: "Cyber Security",
    tags: ["Ethical Hacking", "VAPT", "Networking"],
    prerequisites: ["Networking", "Cyber Security Fundamentals"],
    difficulty: "ADVANCED",
    duration: 35,
  },
  {
    title: "Data Science and Analytics",
    description: "Learn data analysis, visualization and statistical techniques using Python.",
    category: "Data Science",
    tags: ["Python", "Pandas", "Data Analysis"],
    prerequisites: ["Python", "Basic Statistics"],
    difficulty: "INTERMEDIATE",
    duration: 28,
  },
  {
    title: "Cloud Computing with AWS",
    description: "Understand cloud infrastructure, AWS services, deployment and cloud security.",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud", "Cloud Security"],
    prerequisites: ["Computer Networking"],
    difficulty: "INTERMEDIATE",
    duration: 22,
  },
];

async function main() {
  for (const course of courses) {
    await prisma.course.create({ data: course });
  }

  console.log(`${courses.length} courses added successfully.`);
}

main()
  .catch((error) => {
    console.error("Course seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
