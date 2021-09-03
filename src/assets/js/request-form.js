$(function() {
  $('.workspace_request_cta').on('click', function() {
    var requestFormModal = $('#modalRequestFormHorizontal')
    requestFormModal.data('source', 'workspace')
    requestFormModal.modal('show')
  })

  $('.enterprise_request_cta').on('click', function() {
    var requestFormModal = $('#modalRequestFormHorizontal')
    requestFormModal.data("source", "enterprise")
    requestFormModal.modal('show')
  })

  $('#request_form').on('submit', function(e) {
    e.preventDefault()
    var inputData = {}
    $('#request_form :input').each(function(input) {
      inputData[this.name] = $(this).val().trim()
    })

    var application = $('#modalRequestFormHorizontal').data('source')
    var outputData = new FormData()
    outputData.append('application', application)
    outputData.append('name', inputData.firstName + ' ' + inputData.lastName)
    outputData.append('company', inputData.company)
    outputData.append('email', inputData.email)
    outputData.append('title', inputData.title)
    outputData.append('company_size', inputData.companySize)
    outputData.append('phone',
      (inputData.countryCode) ? inputData.countryCode : '' + ' ' + inputData.phone
    )
    
    $.post({
      url: "https://api.cooby.co/leads",
      data: outputData,
      processData: false,
      contentType: false,
      success: function(data)
      {
        console.log("success");
        $('#modalRequestFormHorizontal').modal('hide');
        $('#scheduleModal').modal('show');
      }
    })
  })

  $('#scheduleModalBtn').on('click', function() {
    $('#scheduleModal').modal('hide');
  })
})
