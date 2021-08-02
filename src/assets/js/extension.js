$(function() {
  let scope = window.location.pathname.split('/')[1]
  if (scope !== 'extension') {
    return
  }

  // warning alert
  if (sessionStorage.getItem('isExtensionAlertClosed')) {
    $( "#extension-alert" ).animate({ opacity: 0 }, 300)
  } else {
    $('#extension-alert').css({ 'opacity': 1 })
  }
  
  $('#extension-alert button').on('click', function() {
    if (sessionStorage.getItem('isExtensionAlertClosed')) return
    $( "#extension-alert" ).animate({ opacity: 0 }, 300)
    sessionStorage.setItem('isExtensionAlertClosed', true)
  })

  // fetch reviews
  console.log('ready to get json')
  $.getJSON(window.location.origin + '/reviews.json', function(json) {
    var container = $('#review_cards_container')
    for(var i=0; i<json.length; i++) {
      generateAndAppendReviewCard(container, json[i])
    }
  })
})

// data structure:
// thumbnail: String
// reviewer: String
// content: String
// stars: Int
function generateAndAppendReviewCard(parent, data) {
  var cardBox = $('<div>', { class: 'col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 d-flex' })
  var card = $('<div>', { class: 'card mb-6 mb-lg-0 shadow-light-lg lift lift-lg' })
  var cardBody = $('<a>', { class: 'card-body' })
  var avatarBox = $('<div>', { class: 'd-flex mb-4 align-items-center' })
  var avatarImg = $('<div>', { class: 'avatar avatar-lg me-2 mr-3' }).append($('<img>', { class: 'avatar-img rounded-circle', src: data.thumbnail }))
  var avatarName = $('<h6>', { class: 'text-uppercase text-muted me-2 mb-0' }).text(data.reviewer)
  var divider = $('<hr>', { class: 'card-meta-divider' })
  var content = $('<p>', { class: 'mb-0 text-muted' }).text(data.content)
  var metaBox = $('<div>', { class: 'card-meta mt-auto' })
  var starsHtml = ""
  for(var i=0; i<data.stars; i++) {
    starsHtml += " &#11088"
  }
  var startBox = $('<div>', { class: 'col-12 d-flex justify-content-end px-0' }).html(starsHtml)
  
  avatarBox.append([avatarImg, avatarName])
  cardBody.append([avatarBox, divider, content])
  metaBox.append(startBox)
  card.append([cardBody, metaBox])
  cardBox.append(card)

  parent.append(cardBox)
}