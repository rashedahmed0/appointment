const form = document.getElementById("myForm");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const deptInput = document.getElementById("department");
const doctorInput = document.getElementById("doctor");
const problemInput = document.getElementById("problem");
const slotInput = document.getElementById("slot");

// Department-wise doctors
const doctorsByDepartment = {
  Cardiology: ["Dr. Rahman", "Dr. Hossain", "Dr. Tahmid"],
  Neurology: ["Dr. Ahmed", "Dr. Anwar", "Dr. Faria"],
  Orthopedics: ["Dr. Karim", "Dr. Sadiq", "Dr. Rayhan"],
  Dermatology: ["Dr. Ali", "Dr. Noor", "Dr. Iqbal"],
  ENT: ["Dr. Chowdhury", "Dr. Nasim", "Dr. Zaman"],
};

// Doctor-wise available slots
const doctorAvailability = {
  "Dr. Rahman": ["10:00 AM", "11:00 AM", "3:00 PM"],
  "Dr. Hossain": ["9:00 AM", "2:00 PM"],
  "Dr. Tahmid": ["1:00 PM", "4:00 PM"],
  "Dr. Ahmed": ["10:30 AM", "12:00 PM"],
  "Dr. Karim": ["11:00 AM", "5:00 PM"],
  "Dr. Ali": ["2:30 PM", "4:30 PM"],
};

// Update doctor list based on department
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

// Update slot list when doctor is chosen
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let appointments = localStorage.getItem("appointments")
    ? JSON.parse(localStorage.getItem("appointments"))
    : [];

  const newAppointment = {
    name: nameInput.value.trim(),
    age: ageInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    department: deptInput.value.trim(),
    doctor: doctorInput.value.trim(),
    slot: slotInput.value.trim(),
    problem: problemInput.value.trim(),
    status: "Pending",
  };

  if (!newAppointment.name) {
    alert("Name cannot be empty!");
    return;
  }

  appointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  alert("Appointment Created! Waiting for confirmation.");
  form.reset();
  doctorInput.innerHTML = '<option value="">Select Doctor</option>';
  slotInput.innerHTML = '<option value="">Select Slot</option>';

  const modal = bootstrap.Modal.getInstance(document.getElementById("appointmentForm"));
  modal.hide();
});
