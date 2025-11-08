const tableBody = document.getElementById("data");
const form = document.getElementById("editForm");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const deptInput = document.getElementById("department");
const doctorInput = document.getElementById("doctor");
const slotInput = document.getElementById("slot");
const problemInput = document.getElementById("problem");

let editId = null;

const doctorsByDepartment = {
  Cardiology: ["Dr. Rahman", "Dr. Hossain", "Dr. Tahmid"],
  Neurology: ["Dr. Ahmed", "Dr. Anwar", "Dr. Faria"],
  Orthopedics: ["Dr. Karim", "Dr. Sadiq", "Dr. Rayhan"],
  Dermatology: ["Dr. Ali", "Dr. Noor", "Dr. Iqbal"],
  ENT: ["Dr. Chowdhury", "Dr. Nasim", "Dr. Zaman"],
};

const doctorAvailability = {
  "Dr. Rahman": ["10:00 AM", "11:00 AM", "3:00 PM"],
  "Dr. Hossain": ["9:00 AM", "2:00 PM"],
  "Dr. Tahmid": ["1:00 PM", "4:00 PM"],
  "Dr. Ahmed": ["10:30 AM", "12:00 PM"],
  "Dr. Karim": ["11:00 AM", "5:00 PM"],
  "Dr. Ali": ["2:30 PM", "4:30 PM"],
  "Dr. Chowdhury": ["10:00 AM", "1:00 PM", "3:30 PM"]
};

function getAppointments() {
  return localStorage.getItem("appointments")
    ? JSON.parse(localStorage.getItem("appointments"))
    : [];
}

// Show all appointments in table
function showAppointments() {
  const appointments = getAppointments();
  tableBody.innerHTML = "";
  appointments.forEach((appt, index) => {
    if (!appt || !appt.name) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${appt.name}</td>
      <td>${appt.age}</td>
      <td>${appt.phone}</td>
      <td>${appt.email}</td>
      <td>${appt.department}</td>
      <td>${appt.doctor}</td>
      <td>${appt.slot || "N/A"}</td>
      <td>${appt.problem}</td>
      <td><span class="badge bg-${appt.status === "Confirmed" ? "success" : "warning"}">${appt.status}</span></td>
      <td>
        <button class="btn btn-success" onclick="confirmAppt(${index})"><i class="bi bi-check2-circle"></i></button>
        <button class="btn btn-primary" onclick="editAppt(${index})" data-bs-toggle="modal" data-bs-target="#appointmentForm"><i class="bi bi-pencil-square"></i></button>
        <button class="btn btn-danger" onclick="deleteAppt(${index})"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}
showAppointments();

// Dynamic update of doctors on department change
deptInput.addEventListener("change", () => {
  const selectedDept = deptInput.value;
  doctorInput.innerHTML = '<option value="">Select Doctor</option>';
  slotInput.innerHTML = '<option value="">Select Slot</option>';

  if (selectedDept && doctorsByDepartment[selectedDept]) {
    doctorsByDepartment[selectedDept].forEach((doctor) => {
      const option = document.createElement("option");
      option.value = doctor;
      option.textContent = doctor;
      doctorInput.appendChild(option);
    });
  }
});

// Dynamic update of slots on doctor change
doctorInput.addEventListener("change", () => {
  const selectedDoctor = doctorInput.value;
  slotInput.innerHTML = '<option value="">Select Slot</option>';
  if (doctorAvailability[selectedDoctor]) {
    doctorAvailability[selectedDoctor].forEach((time) => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      slotInput.appendChild(option);
    });
  }
});

// Confirm appointment
function confirmAppt(index) {
  const appointments = getAppointments();
  const appt = appointments[index];

  if (appt.status === "Confirmed") {
    alert("Already confirmed!");
    return;
  }

  const availableSlots = doctorAvailability[appt.doctor] || [];
  if (!availableSlots.includes(appt.slot)) {
    alert(`Slot ${appt.slot} for ${appt.doctor} is not available.`);
    return;
  }

  doctorAvailability[appt.doctor] = availableSlots.filter(s => s !== appt.slot);
  appt.status = "Confirmed";
  localStorage.setItem("appointments", JSON.stringify(appointments));
  showAppointments();
  alert(`Appointment for ${appt.name} confirmed at ${appt.slot}`);
}

// Edit appointment
function editAppt(index) {
  const appointments = getAppointments();
  const appt = appointments[index];
  if (!appt) return;

  nameInput.value = appt.name;
  ageInput.value = appt.age;
  phoneInput.value = appt.phone;
  emailInput.value = appt.email;
  deptInput.value = appt.department;

  // Trigger department change to populate doctors
  const event = new Event("change");
  deptInput.dispatchEvent(event);

  doctorInput.value = appt.doctor;

  // Trigger doctor change to populate slots
  doctorInput.dispatchEvent(new Event("change"));
  slotInput.value = appt.slot;

  problemInput.value = appt.problem;
  editId = index;
}

// Delete appointment
function deleteAppt(index) {
  const appointments = getAppointments();
  if (confirm("Delete this appointment?")) {
    appointments.splice(index, 1);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    showAppointments();
  }
}

// Update form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!nameInput.value.trim()) {
    alert("Name cannot be empty!");
    return;
  }

  const appointments = getAppointments();
  const updatedAppt = {
    name: nameInput.value.trim(),
    age: ageInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    department: deptInput.value.trim(),
    doctor: doctorInput.value.trim(),
    slot: slotInput.value.trim(),
    problem: problemInput.value.trim(),
    status: appointments[editId].status,
  };

  appointments[editId] = updatedAppt;
  localStorage.setItem("appointments", JSON.stringify(appointments));
  showAppointments();
  alert("Appointment updated!");
  const modal = bootstrap.Modal.getInstance(document.getElementById("appointmentForm"));
  modal.hide();
  form.reset();
  editId = null;
});
