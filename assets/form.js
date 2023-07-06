// This JavaScript code snippet is created by Yusuf Senel for personal use on the website log-sysdev.de.
// All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited.
// This code is provided as-is and without warranty of any kind.

$(document).ready(function() {
    var currentStep = 1;
    var selectedService;

    function setProgress(step) {
        var progress = (step / 3) * 100;
        $("#progress-bar").css("width", progress + "%").attr("aria-valuenow", progress);
    }

    function showStep(step) {
        $(".service-details").hide();
        if (step === 1) {
            $("#step-1").show();
        } else if (step === 2) {
            $("#step-2-" + selectedService).show();
        } else if (step === 3) {
            $("#step-3").show();
        }

        if (step > 1) {
            $("#prev-btn").show();
        } else {
            $("#prev-btn").hide();
        }

        if (step === 3) {
            $("#submit-button").show();
        } else {
            $("#submit-button").hide();
        }
    }

    $("#step-1 .icon-card").click(function() {
        selectedService = $(this).data('service');
        $("#service").val(selectedService);
        currentStep = 2;
        showStep(currentStep);
        setProgress(currentStep);
    });

    $("[id^=step-2] .icon-card").click(function() {
        currentStep = 3;
        showStep(currentStep);
        setProgress(currentStep);
    });

    $("#prev-btn").click(function() {
        currentStep--;
        showStep(currentStep);
        setProgress(currentStep);
    });

    showStep(currentStep);

    $(".next-input").on('input', function() {
        if ($(this).attr("id") === "email") {
            var email = $(this).val();
            if (!isValidEmail(email)) {
                $("#progress-bar").addClass("bg-danger");
                $("#progress-bar").addClass("progress-bar-pulse");
                return;
            } else {
                $("#progress-bar").removeClass("bg-danger");
                $("#progress-bar").removeClass("progress-bar-pulse");
            }
        }

        $(this).next(".next-label").show();
        $(this).next(".next-label").next(".next-input").show();
    });

    function isValidEmail(email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    var budgetSlider = document.getElementById("budget");
    var budgetValue = document.getElementById("budget-value");

    budgetSlider.addEventListener("input", function() {
        budgetValue.textContent = "$" + budgetSlider.value;
    });

    var submitButton = document.getElementById("submit-button");
    submitButton.style.backgroundColor = "blue";

    function showMessage(type, message) {
        var alertContainer = document.getElementById("alert-container");
        var newAlert = document.createElement("div");
        newAlert.className = "alert alert-" + type;
        newAlert.role = "alert";
        newAlert.textContent = message;
        alertContainer.appendChild(newAlert);
    }

    $("#submit-button").click(function(event) {
        event.preventDefault();

        $('#clientName').val($('#name').val());
        $('#clientEmail').val($('#email').val());
        $('#projectDescription').val($('#description').val());
        $('#projectDate').val($('#project-date').val());
        $('#budgetAmount').val($('#budget').val());

        var service = $('#service').val();
        var webdesignOption = $('#webdesignOption').val();
        var logoOption = $('#logoOption').val();
        var otherOption = $('#otherOption').val();
        var clientName = $('#clientName').val();
        var clientEmail = $('#clientEmail').val();
        var projectDescription = $('#projectDescription').val();
        var projectDate = $('#projectDate').val();
        var budgetAmount = $('#budgetAmount').val();
        var recaptchaResponse = grecaptcha.getResponse();

        if (clientName.length < 1 || projectDescription.length < 1) {
            showMessage("danger", "Please fill in all fields correctly (Name & Description).");
            return;
        }

        if (!isValidEmail(clientEmail)) {
            showMessage("danger", "Please fill in all fields correctly (Email).");
            return;
        }

        if (projectDate.length === 0) {
            showMessage("danger", "Please fill in all fields correctly (Deadline).");
            return;
        }

        if (budgetAmount.length === 0) {
            showMessage("danger", "Please fill in all fields correctly (Budget).");
            return;
        }

        $("#submit-button").prop("disabled", true);

        $.ajax({
            url: '/offer',
            type: "POST",
            data: {
                'clientName': clientName,
                'clientEmail': clientEmail,
                'projectDescription': projectDescription,
                'projectDate': projectDate,
                'budgetAmount': budgetAmount
            },
            success: function(data) {
                if (data.success) {
                    showMessage("success", "Offer successfully submitted!");

                    // Reset form and return to step 1
                    $("#offerForm")[0].reset();
                    currentStep = 1;
                    showStep(currentStep);
                    setProgress(currentStep);
                } else {
                    showMessage("danger", "Something went wrong. Please try again.");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Fehlerstatus: " + textStatus);
                console.log("Fehlernachricht: " + errorThrown);
                showMessage("danger", "Something went wrong. Please try again.");
            },
            complete: function() {
                $("#submit-button").prop("disabled", false);
                grecaptcha.reset();
            }
        });
    });

    $('.icon-card').on('click', function() {
        var serviceValue = $(this).data('service');
        $('#service').val(serviceValue);
    });

    $(".icon-card").click(function() {
        $(".icon-card.active").removeClass("active");
        $(this).addClass("active");
    });
});
