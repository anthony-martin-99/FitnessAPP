const exercises = {
  1: ["Machine Chest Press", "Incline Chest Press", "Dumbbell Fly", "Shoulder Press", "Triceps Pushdown", "Plank"],
  2: ["Lat Pulldown", "Seated Row", "Single-arm Dumbbell Row", "Face Pulls", "Bicep Curls", "Core Circuit"],
  3: ["Treadmill Intervals", "Farmer’s Carries", "Mountain Climbers", "Ab Rollouts"],
  4: ["Incline Chest Press", "Chest Fly", "Lat Pulldown", "Seated Row", "Pushups", "Cable Crunches"],
  5: ["Deadlifts", "Bench Press", "Pull-ups", "Shoulder Lateral Raises", "Sit-ups", "Leg Raises", "Plank"]
};

const daySelect = document.getElementById("daySelect");
const exerciseList = document.getElementById("exerciseList");
const popup = document.getElementById("popup");

let workoutHistory = JSON.parse(localStorage.getItem("workoutHistory")) || [];
let lastSync = localStorage.getItem("lastSync") ? new Date(localStorage.getItem("lastSync")) : new Date(0);

function renderExercises(day) {
  exerciseList.innerHTML = "";
  exercises[day].forEach(ex => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${ex}</h3>
      <label>Weight (lbs): <input type="number" min="0" max="500" step="1" value="0" class="weight"></label>
      <label>Sets: <input type="number" min="1" max="999" value="3" class="sets"></label>
      <label>Reps: <input type="number" min="1" max="999" value="10" class="reps"></label>
    `;
    exerciseList.appendChild(div);
  });
}

daySelect.addEventListener("change", () => renderExercises(daySelect.value));
renderExercises(daySelect.value);

document.getElementById("saveBtn").addEventListener("click", () => {
  const today = new Date().toISOString().split('T')[0];
  const day = daySelect.value;
  const entries = [];

  Array.from(exerciseList.children).forEach(div => {
    const exercise = div.querySelector("h3").textContent;
    const weight = div.querySelector(".weight").value;
    const sets = div.querySelector(".sets").value;
    const reps = div.querySelector(".reps").value;

    entries.push({date: today, day, exercise, weight, sets, reps});
  });

  workoutHistory.push(...entries);
  localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
  showPopup("Workout saved ✅");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const newEntries = workoutHistory.filter(entry => new Date(entry.date) > lastSync);

  if (newEntries.length === 0) {
    showPopup("No new workouts to export ⚠️");
    return;
  }

  let csvContent = "Date,Day,Exercise,Weight,Sets,Reps\n";
  workoutHistory.forEach(e => {
    csvContent += `${e.date},${e.day},${e.exercise},${e.weight},${e.sets},${e.reps}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Anthony_workouts.csv";
  link.click();

  lastSync = new Date();
  localStorage.setItem("lastSync", lastSync.toISOString());
  showPopup("Exported new workouts ✅");
});

function showPopup(message) {
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 3000);
}
