$('#signup_form').submit(function(e){
  e.preventDefault();
  var inputData = {}
  $('#signup_form :input').each(function(input) {
    inputData[this.name] = $(this).val().trim()
  })
  var outputData = new FormData()
  var name
  if (!inputData.firstName && !inputData.lastName) { // deal with zh-tw version form
    name = inputData.name
  } else {
    name = inputData.firstName + ' ' + inputData.lastName
  }
  outputData.append('application', 'mobile CRM')
  outputData.append('name', name)
  outputData.append('company', inputData.company)
  outputData.append('email', inputData.email)
  outputData.append('title', inputData.title)
  outputData.append('motivation', inputData.motivation)
  outputData.append('phone', 
    (inputData.countryCode) ? inputData.countryCode : '' + ' ' + inputData.phone
  )

  //do some verification
  $.post({
    url: "https://api.cooby.co/leads",
    data: outputData,
    processData: false,
    contentType: false,
    success: function(data)
    {
      console.log("success");
      $('#modalSignupHorizontal').modal('hide');
      $('#confirmationModal').modal('show');
    }
  });
});

$('#confirmationModalBtn').on('click', function() {
  $('#confirmationModal').modal('hide');
})

// deprecated
// $('#downloadAndScheduleModalBtn').click(function(e) {
//   $('#downloadAndScheduleModal').modal('hide');
// });

$(document).ready(function() {
  
  if(window.location.href.indexOf('#signupModal') != -1) {
    $('#modalSignupHorizontal').modal('show');
  }

  $.getJSON(window.location.origin + '/country-codes.json', function(json) {
    var signupCountryCodeContainer = $('#signup_country-code-selector')
    var workspaceCountryCodeContainer = $('#workspace_country-code-selector')

    appendCountryCodeOption(json, signupCountryCodeContainer)
    appendCountryCodeOption(json, workspaceCountryCodeContainer)
  })

  function appendCountryCodeOption(json, targetEl) {
    for(var i=0; i<json.length-1; i++) {
      var option = $('<option>', {value: json[i].dial_code}).text(json[i].name + ' ' + json[i].dial_code)
      targetEl.append(option)
    }
  }
});
