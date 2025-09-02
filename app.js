const form = document.getElementById('exercise-form');
const tableBody = document.querySelector('#exercise-table tbody');

function loadExercises() {
  const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
  tableBody.innerHTML = '';
  exercises.forEach(ex => addRow(ex));
}

function addRow(ex) {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${ex.exercise}</td><td>${ex.weight}</td><td>${ex.reps}</td><td>${ex.sets}</td>`;
  tableBody.appendChild(row);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const exercise = document.getElementById('exercise').value;
  const weight = document.getElementById('weight').value;
  const reps = document.getElementById('reps').value;
  const sets = document.getElementById('sets').value;
  const ex = { exercise, weight, reps, sets };
  
  const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
  exercises.push(ex);
  localStorage.setItem('exercises', JSON.stringify(exercises));

  addRow(ex);
  form.reset();
});

loadExercises();