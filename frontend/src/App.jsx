import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Code2,
  ShieldCheck,
  Database,
  Star,
  Clock,
  Users,
  PlayCircle,
  Sparkles,
  GraduationCap,
  Target,
  ChartNoAxesCombined,
  Menu,
  X,
  CheckCircle2,
  Laptop,
  Rocket,
} from "lucide-react";

const courses = [
  {
    title: "Complete Python Programming",
    category: "Programming",
    level: "Beginner",
    duration: "12 hours",
    rating: "4.9",
    students: "2.4k",
    price: "Free",
    icon: Code2,
    color: "bg-blue-100 text-blue-600",
    progress: "95%",
  },
  {
    title: "Machine Learning Fundamentals",
    category: "Artificial Intelligence",
    level: "Intermediate",
    duration: "18 hours",
    rating: "4.8",
    students: "1.8k",
    price: "Free",
    icon: BrainCircuit,
    color: "bg-violet-100 text-violet-600",
    progress: "89%",
  },
  {
    title: "Cybersecurity Essentials",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "10 hours",
    rating: "4.9",
    students: "3.1k",
    price: "Free",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600",
    progress: "87%",
  },
  {
    title: "Data Science with Python",
    category: "Data Science",
    level: "Advanced",
    duration: "20 hours",
    rating: "4.7",
    students: "1.2k",
    price: "Free",
    icon: Database,
    color: "bg-orange-100 text-orange-600",
    progress: "82%",
  },
];

const categories = [
  { name: "Artificial Intelligence", icon: BrainCircuit, count: "24 Courses" },
  { name: "Cybersecurity", icon: ShieldCheck, count: "18 Courses" },
  { name: "Web Development", icon: Code2, count: "32 Courses" },
  { name: "Data Science", icon: Database, count: "16 Courses" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <BrainCircuit size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Learn<span className="text-indigo-600">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#home" className="text-indigo-600">Home</a>
          <a href="#courses" className="hover:text-indigo-600">Explore Courses</a>
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
            Login
          </a>
          <a href="/register" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
            Get Started <ArrowRight className="ml-1 inline" size={16} />
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="space-y-4 border-t border-slate-100 bg-white px-6 py-5 md:hidden">
          <a onClick={() => setMenuOpen(false)} href="#home" className="block">Home</a>
          <a onClick={() => setMenuOpen(false)} href="#courses" className="block">Explore Courses</a>
          <a onClick={() => setMenuOpen(false)} href="#features" className="block">Features</a>
          <a onClick={() => setMenuOpen(false)} href="#how-it-works" className="block">How It Works</a>
          <a href="/login" className="block font-semibold text-indigo-600">Login</a>
          <a href="/register" className="block rounded-xl bg-indigo-600 px-5 py-3 text-center text-white">Get Started</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">

        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            <Sparkles size={16} />
            AI-powered personalized learning
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Learn smarter.
            <br />
            Grow <span className="text-indigo-600">faster.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Discover courses tailored to your interests, skills and learning
            goals. Let AI create a learning journey that is uniquely yours.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="/register" className="rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700">
              Start Learning <ArrowRight className="ml-2 inline" size={18} />
            </a>

            <a href="#courses" className="rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600">
              <PlayCircle className="mr-2 inline" size={18} />
              Explore Courses
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["S", "A", "R", "K"].map((letter, i) => (
                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-sm font-bold text-indigo-700">
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                4.9/5 learner satisfaction
              </div>
              <p className="text-xs text-slate-500">Join our learning community</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" />

          <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Your learning dashboard</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Welcome back, Learner!</h3>
              </div>
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <GraduationCap size={25} />
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
              <div className="flex items-center gap-2 text-sm text-indigo-100">
                <Sparkles size={16} />
                AI Recommendation
              </div>
              <h3 className="mt-3 text-xl font-bold">Machine Learning Fundamentals</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Selected based on your interests and skill level.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Intermediate</span>
                <span className="text-sm font-bold">95% Match</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between">
                <h4 className="font-bold text-slate-800">Your learning progress</h4>
                <span className="text-sm font-bold text-indigo-600">72%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[72%] rounded-full bg-indigo-600" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <BookOpen className="text-indigo-600" />
                <p className="mt-3 text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500">Courses explored</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <Target className="text-emerald-600" />
                <p className="mt-3 text-2xl font-bold text-slate-900">8</p>
                <p className="text-xs text-slate-500">Skills developing</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:block">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CheckCircle2 className="text-emerald-500" size={18} />
              Learning goal achieved!
            </div>
            <p className="mt-1 text-xs text-slate-500">Keep up the great work.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "100+", label: "Learning Courses", icon: BookOpen },
    { value: "500+", label: "Active Learners", icon: Users },
    { value: "50+", label: "Skills to Explore", icon: Target },
    { value: "24/7", label: "Learn Anytime", icon: Clock },
  ];

  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="text-center">
            <item.icon className="mx-auto mb-3 text-indigo-600" size={25} />
            <h3 className="text-3xl font-extrabold text-slate-900">{item.value}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-indigo-600">EXPLORE BY INTEREST</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Learn what you love
            </h2>
            <p className="mt-3 text-slate-500">Explore popular learning categories.</p>
          </div>
          <a href="#courses" className="font-semibold text-indigo-600 hover:text-indigo-800">
            View all courses <ArrowRight className="ml-1 inline" size={17} />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <a href="#courses" key={cat.name} className="group rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
              <div className="mb-5 inline-flex rounded-2xl bg-indigo-50 p-4 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <cat.icon size={28} />
              </div>
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{cat.count}</p>
              <ChevronRight className="mt-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section id="courses" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-semibold text-indigo-600">POPULAR COURSES</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Start your learning journey
          </h2>
          <p className="mt-3 text-slate-500">
            Explore some of the courses available on our platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <div key={course.title} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className={`rounded-3xl p-7 ${course.color}`}>
                  <course.icon size={52} />
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {course.category}
                </p>
                <h3 className="mt-2 min-h-12 font-bold leading-6 text-slate-900">
                  {course.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> {course.rating}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{course.level}</span>
                  <span className="font-bold text-emerald-600">{course.price}</span>
                </div>

                <a href="/register" className="mt-5 block rounded-xl border border-indigo-100 py-3 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white">
                  Explore Course <ArrowRight className="ml-1 inline" size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/register" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white transition hover:bg-indigo-700">
            Explore All Courses <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Recommendations",
      text: "Discover courses based on your interests, skills and learning history.",
    },
    {
      icon: Target,
      title: "Personalized Difficulty",
      text: "Understand whether a course is beginner, intermediate or advanced for you.",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Track Your Progress",
      text: "Monitor your learning activity, course completion and skill development.",
    },
    {
      icon: Laptop,
      title: "Learn at Your Pace",
      text: "Access your learning journey through a simple and responsive platform.",
    },
  ];

  return (
    <section id="features" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-semibold text-indigo-600">WHY LEARNAI?</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            A smarter way to learn
          </h2>
          <p className="mt-4 text-slate-500">
            More than a course catalog. A personalized learning experience
            designed around you.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 inline-flex rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                <feature.icon size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: "01", title: "Create Your Profile", text: "Tell us about your interests, educational background and learning goals.", icon: Users },
    { number: "02", title: "Get AI Recommendations", text: "Our recommendation engine identifies courses suited to your profile.", icon: Sparkles },
    { number: "03", title: "Learn & Grow", text: "Start learning, track progress and receive better recommendations over time.", icon: Rocket },
  ];

  return (
    <section id="how-it-works" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="font-semibold text-indigo-600">SIMPLE PROCESS</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            How it works
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
              <span className="absolute right-6 top-5 text-4xl font-extrabold text-indigo-100">{step.number}</span>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <step.icon size={30} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 to-violet-700 px-8 py-16 text-center text-white md:px-16">
        <Sparkles className="mx-auto mb-5" size={36} />
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Your learning journey starts here.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
          Discover personalized courses, develop new skills and make every
          learning moment count.
        </p>
        <a href="/register" className="mt-8 inline-flex items-center rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 transition hover:bg-indigo-50">
          Get Started for Free <ArrowRight className="ml-2" size={18} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <BrainCircuit size={27} className="text-indigo-400" />
            <span className="text-xl font-extrabold">LearnAI</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            An AI-powered e-learning platform that makes education more
            personalized, accessible and effective.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">Quick Links</h3>
          <div className="space-y-3 text-sm">
            <a href="#home" className="block hover:text-indigo-400">Home</a>
            <a href="#courses" className="block hover:text-indigo-400">Courses</a>
            <a href="#features" className="block hover:text-indigo-400">Features</a>
            <a href="#how-it-works" className="block hover:text-indigo-400">How It Works</a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">Get Started</h3>
          <div className="space-y-3 text-sm">
            <a href="/login" className="block hover:text-indigo-400">Login</a>
            <a href="/register" className="block hover:text-indigo-400">Create Account</a>
            <p className="text-slate-400">Learn at your own pace, anywhere.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 pt-7 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} LearnAI. AI-Powered E-Learning Personalized Recommendation System.
      </div>
    </footer>
  );
}
function DashboardPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <BrainCircuit className="mx-auto text-indigo-600" size={50} />

        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
          Welcome to LearnAI!
        </h1>

        <p className="mt-3 text-slate-500">
          Authentication successful. Your personalized learner dashboard
          will be available here.
        </p>

        <CheckCircle2 className="mx-auto mt-6 text-emerald-500" size={35} />
        <p className="mt-2 font-semibold text-emerald-600">
          Protected route accessed successfully
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white font-sans">
              <Navbar />
              <main>
                <Hero />
                <Stats />
                <Categories />
                <Courses />
                <Features />
                <HowItWorks />
                <CTA />
              </main>
              <Footer />
            </div>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                  404 - Page Not Found
                </h1>
                <Link
                  to="/"
                  className="mt-4 inline-block text-indigo-600"
                >
                  Return Home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
