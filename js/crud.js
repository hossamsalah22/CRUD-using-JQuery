$(function () {
	function loadData() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/employees",
			dataType: "json",
			success: function (response) {
				$(".employees-list").empty();
				displayEmployees(response);
			},
		});
	} // Load Json File

	loadData();

	function displayEmployees(employees) {
		console.log(employees);
		employees.forEach(function (empData) {
			let newLi = $(`<li class="employee">
                                <div class="employee-content">
                                    <h1 class="employee-name">${empData.Name}</h1>
                                    <h3 class="employee-age">${empData.Age}</h3>
                                    <h3 class="employee-salary">${empData.Salary}</h3>
                                </div>
                                <button class="btn-edit" data-id="${empData.id}">Edit</button>
                                <button class="btn-delete" data-id="${empData.id}">Delete</button>
                            </li>`);
			$(".employees-list").append(newLi);
		});
	} // Fetch employees from JSON File

	function addEmployee(_name, _age, _salary) {
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/employees",
			dataType: "json",
			data: {
				Name: _name,
				Age: _age,
				Salary: _salary,
			},
			success: function () {
				loadData();
			},
		});
	} // Add employee To the JSON File

	$(".form").on("submit", function (e) {
		e.preventDefault();
		let empName;
		let empAge;
		let empSal;
		$("#employeeName").focus(function () {
			if (!isNaN($("#employeeName").val())) {
				empName = "";
			}
		});
		$("#employeeAge").focus(function () {
			if (isNaN($("#employeeAge").val())) {
				empAge = "";
			}
		});
		$("#employeeSalary").focus(function () {
			if (isNaN($("#employeeSalary").val())) {
				empSal = "";
			}
		});
		if (empName != "" && empAge != "" && empSal != "") {
			console.log($("#employeeName").val(), $("#employeeAge").val(), $("#employeeSalary").val());
			// addEmployee(empName, empAge, empSal);
			$("#employeeName").val("");
			$("#employeeAge").val("");
			$("#employeeSalary").val("");
			$("#addEmployee").css({
				display: "block",
			});
			$(this).css({
				display: "none",
			});
		}
	}); // Add employee Button

	$("#addEmployee").on("click", function () {
		$(".form").css({
			display: "block",
		});
		$(this).css({
			display: "none",
		});
	}); // add employee button to show From

	function deleteEmployee(id) {
		// console.log(id);
		$.ajax({
			method: "DELETE",
			url: `http://localhost:3000/employees/${id}`,
			dataType: "json",
			success: function () {
				loadData();
			},
		});
	} // remove employee from JSON File

	$(".employees-list").on("click", ".btn-delete", function () {
		empId = $(this).data("id");
		$.confirm({
			title: "Confirm Delete!",
			content: "Are you sure you want to Delete this Employee?",
			buttons: {
				confirm: function () {
					deleteEmployee(empId);
				},
				cancel: function () {
					$.alert("Canceled!");
				},
			},
		});
	}); // Confirm Delete

	function updateEmployee(id, _name, _age, _salary) {
		$.ajax({
			method: "PATCH",
			url: `http://localhost:3000/employees/${id}`,
			dataType: "json",
			data: {
				Name: _name,
				Age: _age,
				Salary: _salary,
			},
			success: function () {
				loadData();
			},
		});
	} // Update employee In JSON file

	$(".employees-list").on("click", ".btn-edit", function (e) {
		e.preventDefault();

		let nameToEdit = $(this).parent().find(".employee-name");
		let ageToEdit = $(this).parent().find(".employee-age");
		let salaryToEdit = $(this).parent().find(".employee-salary");

		$(this).toggleClass("editable");

		if ($(this).hasClass("editable")) {
			let nameToEditText = nameToEdit.text();
			let ageToEditText = ageToEdit.text();
			let salaryToEditText = salaryToEdit.text();

			nameToEdit.replaceWith(`<input type="text" class="employee-name" value="${nameToEditText}" />`);
			ageToEdit.replaceWith(`<input type="text" class="employee-age" value="${ageToEditText}" />`);
			salaryToEdit.replaceWith(`<input type="text" class="employee-age" value="${salaryToEditText}" />`);

			$(this).text("Submit");
		} else {
			if ((nameToEdit.val() != "" && ageToEdit.val() != "", salaryToEdit.val() != "")) {
				let modId = $(this).data("id");
				let thisName = nameToEdit.val();
				let thisAge = ageToEdit.val();
				let thisSalary = salaryToEdit.val();
				nameToEdit.replaceWith(` <h1 class="employee-name">${thisName}</h1>`);
				ageToEdit.replaceWith(` <h3 class="employee-age">${thisAge}</h3>`);
				ageToEdit.replaceWith(` <h3 class="employee-age">${thisSalary}</h3>`);
				updateEmployee(modId, thisName, thisAge, thisSalary);
				$(this).text("Edit");
			}
		}
	}); // Edit Button
});
