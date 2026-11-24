
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, User, Mail, ShieldCheck, LogOut } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState("");
  const [likedCourseIds, setLikedCourseIds] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState("");
  const [difficultyPredictions, setDifficultyPredictions] = useState([]);
  const [difficultyLoading, setDifficultyLoading] = useState(false);
  const [difficultyError, setDifficultyError] = useState("");
  const [difficultyMetrics, setDifficultyMetrics] = useState([]);
  const [difficultyFeedbackStatus, setDifficultyFeedbackStatus] = useState({});
  const [difficultyFeedbackError, setDifficultyFeedbackError] = useState("");

  const [profileForm, setProfileForm] = useState({
  education: "",
  skills: "",
  interests: "",
  goals: "",
});

  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);

      const profileResponse = await api.get("/profile");
      const savedProfile = profileResponse.data.profile;

      setProfile(savedProfile);

      setProfileForm({
        education: savedProfile?.education || "",
        skills: savedProfile?.skills?.join(", ") || "",
        interests: savedProfile?.interests?.join(", ") || "",
        goals: savedProfile?.goals?.join(", ") || "",
      });
    } catch (err) {
      setError("Unable to load user details.");
    } finally {
      setLoading(false);
    }

    try {
  const coursesResponse = await api.get("/courses");
  setCourses(coursesResponse.data.courses);
} catch (err) {
  setCoursesError("Unable to load courses.");
} finally {
  setCoursesLoading(false);
}

try {
  const enrollmentResponse = await api.get("/enrollments/my-courses");
  setMyEnrollments(enrollmentResponse.data.enrollments);
} catch (err) {
  setEnrollmentError("Unable to load your enrolled courses.");
} finally {
  setEnrollmentLoading(false);
}

try {
  const recommendationsResponse = await api.get("/recommendations");
  setRecommendations(recommendationsResponse.data.recommendations);
} catch (err) {
  setRecommendationsError("Unable to load recommendations.");
} finally {
  setRecommendationsLoading(false);
}

try {
  const predictionResponse = await api.get(
    "/difficulty/my-predictions"
  );

  setDifficultyPredictions(predictionResponse.data.predictions);
} catch (err) {
  console.error("Unable to load saved difficulty predictions:", err);
}

try {
  const metricsResponse = await api.get("/difficulty/metrics");
  setDifficultyMetrics(metricsResponse.data.metrics);
} catch (err) {
  console.error("Unable to load model metrics:", err);
}


  };

  fetchUser();
}, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  const handleProfileChange = (e) => {
  setProfileForm({
    ...profileForm,
    [e.target.name]: e.target.value,
  });
};

const handleProfileSave = async (e) => {
  e.preventDefault();

  try {
    setSavingProfile(true);
    setError("");

    const response = await api.put("/profile", {
      education: profileForm.education.trim(),
      skills: profileForm.skills.split(",").map(item => item.trim()).filter(Boolean),
      interests: profileForm.interests.split(",").map(item => item.trim()).filter(Boolean),
      goals: profileForm.goals.split(",").map(item => item.trim()).filter(Boolean),
    });

    setProfile(response.data.profile);
    setIsEditingProfile(false);
  } catch (err) {
    setError(
      err.response?.data?.message || "Unable to update profile."
    );
  } finally {
    setSavingProfile(false);
  }
};


const handleEnroll = async (courseId) => {
  try {
    setEnrollingCourseId(courseId);
    setEnrollmentError("");

    const response = await api.post("/enrollments", { courseId });

    setMyEnrollments((previous) => [
      response.data.enrollment,
      ...previous,
    ]);
    const recommendationResponse = await api.get("/recommendations");
setRecommendations(recommendationResponse.data.recommendations);
  } catch (err) {
    setEnrollmentError(
      err.response?.data?.message || "Unable to enroll in this course."
    );
  } finally {
    setEnrollingCourseId("");
  }
};

const handleProgressUpdate = async (enrollmentId, progress) => {
  try {
    const response = await api.patch(
      `/enrollments/${enrollmentId}/progress`,
      { progress: Number(progress) }
    );

    setMyEnrollments((previous) =>
      previous.map((item) =>
        item.id === enrollmentId ? response.data.enrollment : item
      )
    );
  } catch (err) {
    setEnrollmentError(
      err.response?.data?.message || "Unable to update progress."
    );
  }
};


const handleCourseInteraction = async (courseId, eventType) => {
  try {
    await api.post("/interactions", {
      courseId,
      eventType,
    });

    if (eventType === "LIKE") {
      setLikedCourseIds((previous) =>
        previous.includes(courseId)
          ? previous
          : [...previous, courseId]
      );
    }

    // Refresh personalized recommendations
    const response = await api.get("/recommendations");
    setRecommendations(response.data.recommendations);

  } catch (err) {
    setEnrollmentError(
      err.response?.data?.message || "Unable to record activity."
    );
  }
};

const handleDifficultyPrediction = async () => {
  try {
    setDifficultyLoading(true);
    setDifficultyError("");

    const response = await api.post("/difficulty/predict");

    setDifficultyPredictions(response.data.predictions);

    // Refresh saved model evaluation metrics
    const metricsResponse = await api.get("/difficulty/metrics");

    setDifficultyMetrics(metricsResponse.data.metrics);
  } catch (err) {
    setDifficultyError(
      err.response?.data?.message ||
      "Unable to generate difficulty predictions."
    );
  } finally {
    setDifficultyLoading(false);
  }
};

const handleDifficultyFeedback = async (courseId, rating) => {
  try {
    setDifficultyFeedbackError("");

    await api.post("/difficulty-data/feedback", {
      courseId,
      rating,
    });

    setDifficultyFeedbackStatus((previous) => ({
      ...previous,
      [courseId]: rating,
    }));
  } catch (err) {
    setDifficultyFeedbackError(
      err.response?.data?.message ||
      "Unable to save difficulty feedback."
    );
  }
};


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading your dashboard...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-indigo-600" size={30} />
          <span className="text-xl font-extrabold">
            Learn<span className="text-indigo-600">AI</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Welcome, {user.name}!
        </h1>

        <p className="mt-2 text-slate-500">
          Your personalized learning journey starts here.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <User className="text-indigo-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Full Name</h3>
            <p className="mt-2 text-slate-500">{user.name}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Mail className="text-indigo-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Email</h3>
            <p className="mt-2 break-all text-slate-500">{user.email}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ShieldCheck className="text-emerald-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Account Role</h3>
            <p className="mt-2 text-slate-500">{user.role}</p>
          </div>
        </div>

        {/* Learner Profile Section */}
        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Learner Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your educational background, skills and learning goals.
              </p>
            </div>

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileSave} className="mt-8 space-y-5">
              {[
                {
                  name: "education",
                  label: "Educational Background",
                  placeholder: "e.g. B.Tech Computer Science",
                },
                {
                  name: "skills",
                  label: "Skills",
                  placeholder: "e.g. Python, React, Java",
                },
                {
                  name: "interests",
                  label: "Learning Interests",
                  placeholder: "e.g. AI, Cyber Security",
                },
                {
                  name: "goals",
                  label: "Learning Goals",
                  placeholder: "e.g. Become an AI Engineer",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {field.label}
                  </label>

                  <input
                    type="text"
                    name={field.name}
                    value={profileForm[field.name]}
                    onChange={handleProfileChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  {field.name !== "education" && (
                    <p className="mt-1 text-xs text-slate-400">
                      Separate multiple entries with commas.
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileForm({
                      education: profile?.education || "",
                      skills: profile?.skills?.join(", ") || "",
                      interests: profile?.interests?.join(", ") || "",
                      goals: profile?.goals?.join(", ") || "",
                    });
                  }}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-700">
                  Educational Background
                </h3>
                <p className="mt-2 text-slate-500">
                  {profile?.education || "Not added yet"}
                </p>
              </div>

              {[
                { label: "Skills", values: profile?.skills },
                { label: "Interests", values: profile?.interests },
                { label: "Learning Goals", values: profile?.goals },
              ].map((item) => (
                <div key={item.label}>
                  <h3 className="font-semibold text-slate-700">
                    {item.label}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.values?.length > 0 ? (
                      item.values.map((value) => (
                        <span
                          key={value}
                          className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                        >
                          {value}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400">Not added yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


{/* Course Catalog */}
<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        Explore Courses
      </h2>
      <p className="mt-1 text-slate-500">
        Discover courses to build your skills and achieve your goals.
      </p>
    </div>

    <span className="text-sm font-medium text-indigo-600">
      {courses.length} Courses Available
    </span>
  </div>

  {coursesLoading ? (
    <p className="mt-8 text-slate-500">Loading courses...</p>
  ) : coursesError ? (
    <p className="mt-8 text-red-500">{coursesError}</p>
  ) : courses.length === 0 ? (
    <p className="mt-8 text-slate-500">
      No courses are available yet.
    </p>
  ) : (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex flex-col rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {course.category}
          </span>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            {course.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
            {course.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {course.difficulty}
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {course.duration} hours
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleEnroll(course.id)}
              disabled={
                myEnrollments.some(
                  (item) => item.courseId === course.id
                ) || enrollingCourseId === course.id
              }
              className="flex-1 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {myEnrollments.some(
                (item) => item.courseId === course.id
              )
                ? "Enrolled"
                : enrollingCourseId === course.id
                  ? "Enrolling..."
                  : "Enroll Now"}
            </button>

            <button
              type="button"
              onClick={() =>
                handleCourseInteraction(course.id, "LIKE")
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {likedCourseIds.includes(course.id) ? "Liked" : "Like"}
            </button>

            <button
              type="button"
              onClick={() =>
                handleCourseInteraction(course.id, "VIEW")
              }
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

{/* Personalized Recommendations */}
<section className="mt-10 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
  <div>
    <h2 className="text-2xl font-bold text-slate-800">
      Recommended for You
    </h2>
    <p className="mt-1 text-slate-500">
      Courses selected based on your interests, skills and learning activity.
    </p>
  </div>

  {recommendationsLoading ? (
    <p className="mt-6 text-slate-500">
      Finding courses for you...
    </p>
  ) : recommendationsError ? (
    <p className="mt-6 text-red-500">
      {recommendationsError}
    </p>
  ) : recommendations.length === 0 ? (
    <p className="mt-6 text-slate-500">
      No recommendations available yet. Add your interests and skills
      to your learner profile to get personalized suggestions.
    </p>
  ) : (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((item) => (
        <div
          key={item.id}
          className="flex flex-col rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5"
        >
          <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {item.course.category}
          </span>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            {item.course.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
            {item.course.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              {item.course.difficulty}
            </span>

            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              {item.course.duration} hours
            </span>
          </div>

          <div className="mt-4 rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-indigo-700">
              Why recommended?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {item.feedback || "Matches your learning profile"}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-400">
              Relevance score: {item.rankScore}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() =>
                handleCourseInteraction(item.courseId, "LIKE")
              }
              className="flex-1 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Like
            </button>

            <button
              type="button"
              onClick={() =>
                handleCourseInteraction(item.courseId, "VIEW")
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              View
            </button>

            <button
              type="button"
              onClick={() =>
                handleCourseInteraction(item.courseId, "DISMISS")
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              title="Not interested"
            >
              Hide
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>


{/* ML Difficulty Prediction */}
<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        AI Learning Difficulty Analysis
      </h2>
      <p className="mt-1 text-slate-500">
        Discover which course difficulty levels best match your learning profile.
      </p>
    </div>

    <button
      type="button"
      onClick={handleDifficultyPrediction}
      disabled={difficultyLoading}
      className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {difficultyLoading
        ? "Analysing..."
        : "Analyse My Learning Level"}
    </button>
  </div>

  {difficultyError && (
    <p className="mt-4 text-sm text-red-600">
      {difficultyError}
    </p>
  )}

  {difficultyPredictions.length > 0 ? (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {difficultyPredictions.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-200 p-5"
        >
          <h3 className="font-bold text-slate-800">
            {item.course.title}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Course difficulty: {item.course.difficulty}
          </p>

          <div className="mt-5 rounded-xl bg-indigo-50 p-4">
            <p className="text-xs font-semibold text-indigo-700">
              Predicted Suitable Level
            </p>

            <p className="mt-1 text-xl font-bold text-indigo-800">
              {item.predictedLevel}
            </p>

            <p className="mt-2 text-sm text-indigo-700">
              Model confidence:{" "}
              {Math.round((item.predictedScore || 0) * 100)}%
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Model version: {item.modelVersion || "Unknown"}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-6 text-sm text-slate-500">
      No predictions available yet. Select Analyse My Learning Level
      to generate your personalized predictions.
    </p>
  )}

  {difficultyMetrics.length > 0 && (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h3 className="text-lg font-bold text-slate-800">
        ML Model Evaluation
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Accuracy",
            value: `${(
              (difficultyMetrics[0].metrics?.accuracy || 0) * 100
            ).toFixed(2)}%`,
          },
          {
            label: "Training Records",
            value:
              difficultyMetrics[0].metrics?.training_records ?? "N/A",
          },
          {
            label: "Testing Records",
            value:
              difficultyMetrics[0].metrics?.testing_records ?? "N/A",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-slate-50 p-4"
          >
            <p className="text-sm text-slate-500">
              {metric.label}
            </p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Training data:{" "}
        {difficultyMetrics[0].metrics?.dataset_type || "Not specified"}.
        Metrics are from the model's held-out evaluation set.
      </p>
    </div>
  )}
</section>


{/* My Enrolled Courses */}
<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        My Courses
      </h2>
      <p className="mt-1 text-slate-500">
        Track your learning progress.
      </p>
    </div>
     {difficultyFeedbackError && (
  <p className="mt-3 text-sm text-red-600">
    {difficultyFeedbackError}
  </p>
)}


    <span className="text-sm font-semibold text-indigo-600">
      {myEnrollments.length} Enrolled
    </span>
  </div>

  {enrollmentError && (
    <p className="mt-4 text-sm text-red-500">{enrollmentError}</p>
  )}

  {enrollmentLoading ? (
    <p className="mt-6 text-slate-500">Loading your courses...</p>
  ) : myEnrollments.length === 0 ? (
    <p className="mt-6 text-slate-500">
      You haven't enrolled in any courses yet.
    </p>
  ) : (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {myEnrollments.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800">
                {item.course.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.course.category}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === "COMPLETED"
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {item.status}
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-600">
                Progress
              </span>
              <span className="font-semibold text-indigo-600">
                {item.progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Update learning progress
            </label>

            <select
              value={item.progress}
              onChange={(e) =>
                handleProgressUpdate(item.id, e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="0">0% — Not Started</option>
              <option value="25">25% — Started</option>
              <option value="50">50% — In Progress</option>
              <option value="75">75% — Almost Complete</option>
              <option value="100">100% — Completed</option>
            </select>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
  <p className="mb-3 text-sm font-semibold text-slate-700">
    How difficult was this course for you?
  </p>

  <div className="flex flex-wrap gap-2">
    {[
      { label: "Too Easy", value: "TOO_EASY" },
      { label: "Just Right", value: "JUST_RIGHT" },
      { label: "Too Difficult", value: "TOO_DIFFICULT" },
    ].map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() =>
          handleDifficultyFeedback(item.courseId, option.value)
        }
        className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
          difficultyFeedbackStatus[item.courseId] === option.value
            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>

  {difficultyFeedbackStatus[item.courseId] && (
    <p className="mt-2 text-xs text-emerald-600">
      Feedback saved successfully.
    </p>
  )}
</div>

        </div>
      ))}
    </div>
  )}
</section>

      </main>
    </div>
  );
}
