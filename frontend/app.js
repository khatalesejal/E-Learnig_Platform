// =========================
// app.js (module)
// =========================

// =========================
// AUTHENTICATION
// =========================
export async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) window.location.href = "login.html";
  } catch (err) {
    console.error("Registration error:", err);
    alert("Something went wrong!");
  }
}

export async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("studentName", data.name);
      localStorage.setItem("userId", data.id);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong!");
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("studentName");
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}

// =========================
// DASHBOARD
// =========================
export async function loadDashboard() {
  const studentName = localStorage.getItem("studentName") || "Student";

  const welcomeEl = document.getElementById("welcomeMessage");
  if (welcomeEl) welcomeEl.innerText = `Welcome, ${studentName}!!!`;

  const dateEl = document.getElementById("todayDate");
  if (dateEl) {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    dateEl.innerText = today.toLocaleDateString("en-US", options);
  }

  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/enroll/my-enrollments", {
      headers: { Authorization: `Bearer ${token}` },
    });

    document.getElementById("courseCount").innerText = res.data.length;
    document.getElementById("liveCount").innerText = 0;
    document.getElementById("completedCount").innerText = 0;
  } catch (err) {
    console.error("Dashboard load error:", err);
  }
}

// =========================
// ENROLLMENTS & COURSES
// =========================
export async function enrollCourse(courseId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/enroll/enroll-course",
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message || "Enrolled successfully!");
  } catch (err) {
    console.error("Enroll error:", err.response || err);
    alert(err.response?.data?.message || "Enrollment failed.");
  }
}

// Attach globally for inline HTML usage if needed
window.enrollCourse = enrollCourse;

// Load all courses
export async function loadCourses() {
  try {
    const res = await axios.get("http://localhost:5000/api/courses");
    const container = document.getElementById("courseList");
    if (!container) return;

    container.innerHTML = "";

    res.data.forEach((course) => {
      const div = document.createElement("div");
      div.className = "course-card";
      div.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>₹${course.price}</strong></p>
        <button id="enroll-${course._id}">Enroll</button>
      `;
      container.appendChild(div);

      // Add click event with token
      document.getElementById(`enroll-${course._id}`).addEventListener("click", () => enrollCourse(course._id));
    });
  } catch (err) {
    console.error("Courses load error:", err);
    alert("Failed to load courses.");
  }
}


// =========================
// TAB SWITCHING
// =========================
export function showTab(tabId, event) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((c) => c.classList.add("hidden"));

  document.getElementById(tabId).classList.remove("hidden");

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => t.classList.remove("active"));
  if (event) event.currentTarget.classList.add("active");
}

// =========================
// Attach functions globally
// =========================
window.loadDashboard = loadDashboard;
window.loadCourses = loadCourses;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logout = logout;
window.showTab = showTab;
window.enrollCourse = enrollCourse;


// ✅ Load student profile info
async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("⚠️ Please sign in first!");
    window.location.href = "login.html";
    return;
  }

  try {
    // ⬇️ Replace URL with your backend API endpoint for fetching logged-in user info
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch profile");

    const user = await response.json();

    // ✅ Inject into profile page
    const profileDiv = document.getElementById("profileInfo");
    profileDiv.innerHTML = `
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
    `;
  } catch (err) {
    console.error("Error loading profile:", err);
    document.getElementById("profileInfo").innerHTML =
      "<p>❌ Failed to load profile info.</p>";
  }
}

// Run only on profile.html
if (window.location.pathname.includes("profile.html")) {
  window.addEventListener("DOMContentLoaded", loadProfile);
}
