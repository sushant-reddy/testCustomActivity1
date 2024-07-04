define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var steps = [
    { label: "Select Data Extension", key: "step1" },
    { label: "Configure Split", key: "step2" },
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  function onRender() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");

    // For this example, we'll simulate loading DE list
    loadDataExtensions();

    $("#selectDataExtension").change(function () {
      var selectedDE = $(this).val();
      if (selectedDE) {
        loadFields(selectedDE);
        connection.trigger("updateButton", { button: "next", enabled: true });
      } else {
        connection.trigger("updateButton", { button: "next", enabled: false });
      }
    });

    $("#selectField, #selectCondition, #inputValue").change(function () {
      var field = $("#selectField").val();
      var condition = $("#selectCondition").val();
      var value = $("#inputValue").val();
      if (
        field &&
        condition &&
        (value || condition === "isNull" || condition === "isNotNull")
      ) {
        connection.trigger("updateButton", { button: "next", enabled: true });
      } else {
        connection.trigger("updateButton", { button: "next", enabled: false });
      }
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
        if (key === "dataExtension") {
          $("#selectDataExtension").val(val);
          loadFields(val);
        } else if (key === "field") {
          $("#selectField").val(val);
        } else if (key === "condition") {
          $("#selectCondition").val(val);
        } else if (key === "value") {
          $("#inputValue").val(val);
        }
      });
    });

    connection.trigger("updateButton", { button: "next", enabled: false });
  }

  function onGetTokens(tokens) {
    // console.log(tokens);
  }

  function onGetEndpoints(endpoints) {
    // console.log(endpoints);
  }

  function onClickedNext() {
    if (currentStep.key === "step2") {
      save();
    } else {
      connection.trigger("nextStep");
    }
  }

  function onClickedBack() {
    connection.trigger("prevStep");
  }

  function onGotoStep(step) {
    showStep(step);
    connection.trigger("ready");
  }

  function showStep(step) {
    if (step.key === "step1") {
      $("#step1").removeClass("slds-hide");
      $("#step2").addClass("slds-hide");
    } else if (step.key === "step2") {
      $("#step1").addClass("slds-hide");
      $("#step2").removeClass("slds-hide");
    }
    currentStep = step;
  }

  function loadDataExtensions() {
    // This would typically be an API call to SFMC
    var dummyDEs = ["Customers", "Orders", "Products"];
    var $select = $("#selectDataExtension");
    $.each(dummyDEs, function (i, de) {
      $select.append($("<option></option>").val(de).text(de));
    });
  }

  function loadFields(dataExtension) {
    // This would typically be an API call to SFMC
    var dummyFields = ["Email", "FirstName", "LastName", "OrderTotal"];
    var $select = $("#selectField");
    $select
      .empty()
      .append($("<option></option>").val("").text("Choose a Field..."));
    $.each(dummyFields, function (i, field) {
      $select.append($("<option></option>").val(field).text(field));
    });
  }

  function save() {
    var dataExtension = $("#selectDataExtension").val();
    var field = $("#selectField").val();
    var condition = $("#selectCondition").val();
    var value = $("#inputValue").val();

    payload["arguments"].execute.inArguments = [
      {
        dataExtension: dataExtension,
        field: field,
        condition: condition,
        value: value,
      },
    ];

    payload["metaData"].isConfigured = true;

    connection.trigger("updateActivity", payload);
  }
});
