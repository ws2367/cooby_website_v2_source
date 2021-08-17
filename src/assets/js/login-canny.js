$(function() {
  if (window.location.pathname !== '/login-canny.html' && window.location.pathname !== '/login-canny') {
    return
  }
  // check search params
  var urlParams = new URLSearchParams(window.location.search)
  var companyID = urlParams.get('companyID')
  var redirect = urlParams.get('redirect')
  if (companyID === null || redirect === null) {
    window.location.pathname = '/'
  }

  switchToLogInForm(true)

  $('#canny-login-form #canny-signup-switch').on('click', function() {
    switchToLogInForm(false)
  })
  $('#canny-signup-form #canny-login-switch').on('click', function() {
    switchToLogInForm(true)
  })

  var apiURL = 'https://api.cooby.co'
  var cannyApiURL = '/v1/auth/signon_canny'
  var loginForm = $('#canny-login-form')
  loginForm.on('submit', function(e) {
    e.preventDefault()
    setLoading(true, loginForm)

    var data = generateUserData(loginForm)
    var isLegalPassword = checkPassword(data, false)
    if (!isLegalPassword) {
      setLoading(false, loginForm)
      return
    }

    $.ajax({
      type: 'POST',
      url: apiURL + '/login',
      contentType: 'application/json',
      crossDomain: true,
      data: JSON.stringify(data),
      success: function(res) {
        console.log('success')
        showModalWithMsg(true, 'Redirecting to our roadmap...')
        var authToken = 'Bearer ' + res.token
        postCannyTokenAndRedirect(authToken)
      },
      error: function(res) {
        console.log('log in failed')
        setLoading(false, loginForm)
        showModalWithMsg(false, res.responseJSON.error_message)
      }
    })
  })
  var signupForm = $('#canny-signup-form')
  signupForm.on('submit', function(e) {
    e.preventDefault()
    setLoading(true, signupForm)

    var data = generateUserData(signupForm)
    var isLegalPassword = checkPassword(data, true)
    if (!isLegalPassword) {
      setLoading(false, signupForm)
      return
    }

    // create user api
    $.ajax({
      type: 'POST',
      url: apiURL + '/users',
      contentType: 'application/json',
      crossDomain: true,
      data: JSON.stringify(data),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Cooby-App-Platform', 'Canny')
      },
      success: function(res) {
        console.log('success')
        showModalWithMsg(true, 'You created a Cooby account. Redirecting to our roadmap...')
        var authToken = 'Bearer ' + res.token
        postCannyTokenAndRedirect(authToken)
      },
      error: function(res) {
        console.log(res)
        setLoading(false, signupForm)
        showModalWithMsg(false, res.responseJSON.error_message)
      }
    })
  })


  function postCannyTokenAndRedirect(authToken) {
    $.ajax({
      type: 'POST',
      url: apiURL + cannyApiURL,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', authToken)
        xhr.setRequestHeader('Cooby-App-Platform', 'Canny')
      },
      success: function(res) {
        setLoading(false, loginForm)
        var redirectURL = getRedirectURL(res.token);
        if (redirectURL) {
          window.location.assign(redirectURL);
        }
      },
      error: function(res) {
        setLoading(false, loginForm)
        console.log('canny token failed')
        showModalWithMsg(false, res.responseJSON.error_message)
      }
    })
  }

  // functions
  function checkPassword(data, hasConfirmPassword) {
    if (data.password.length < 8 || (hasConfirmPassword && data.confirmPassword.length < 8)) {
      showModalWithMsg(false, 'Password should be minimum 8 characters')
      return false
    }
    if (hasConfirmPassword && (data.password !== data.confirmPassword)) {
      showModalWithMsg(false, 'Passwords do not match')
      return false
    }
    return true
  }

  function generateUserData(form) {
    var result = {}
    form.serializeArray().forEach(function(input) {
      result[input.name] = input.value
    })
    return result
  }

  function setLoading(bool, target) {
    if (bool) {
      target.find('.canny-cta-button').prop('disabled', true)
      target.find('.canny-cta-button span').show()
      target.find('.canny-cta-button p').hide()
    } else {
      target.find('.canny-cta-button').prop('disabled', false)
      target.find('.canny-cta-button span').hide()
      target.find('.canny-cta-button p').show()
    }
  }

  function switchToLogInForm(isLogIn) {
    if (isLogIn) {
      $('#canny-login-form').show()
      $('#canny-signup-form').hide()
    } else {
      $('#canny-login-form').hide()
      $('#canny-signup-form').show()
    }
  }

  function showModalWithMsg(isSuccess, msg) {
    if (isSuccess) {
      $('#popupModal button').hide()
      $('#popupModal .btn').hide()
    } else {
      $('#popupModal button').show()
      $('#popupModal .btn').show()
    }
    $('#popupModal').modal('show')
    $('#popupModal #modalExampleTitle').text(isSuccess ? 'Success' : 'Error')
    $('#popupModal #popupMsg').text(msg)
  }

  function getQueryParameterByName(name) {
    var pairStrings = window.location.search.slice(1).split('&');
    var pairs = pairStrings.map(function(pair) {
      return pair.split('=');
    });
    return pairs.reduce(function(value, pair) {
      if (value) return value;
      return pair[0] === name ? decodeURIComponent(pair[1]) : null;
    }, null);
  }
  function getRedirectURL(ssoToken) {
    var redirectURL = getQueryParameterByName('redirect')
    var companyID = getQueryParameterByName('companyID')
    if (redirectURL.indexOf('https://') !== 0 || !companyID) {
      return null;
    }
    return 'https://canny.io/api/redirects/sso?companyID=' + companyID + '&ssoToken=' + ssoToken + '&redirect=' + redirectURL;
  }
})
