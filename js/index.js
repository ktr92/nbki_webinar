$(document).ready(function () {
  $("input[type=tel]").mask("+7 (999) 999-99-99")
  $("input.inn").mask("9999999999")

  $("#id_check").on("change", function (e) {
    if ($(this).is(":checked")) {
      $("#formsubmit").removeAttr("disabled")
    } else {
      $("#formsubmit").prop("disabled", true)
    }
  })

  $("a.scrollTo").click(function () {
    var destination = $($(this).attr("href")).offset().top - 30
    $("html:not(:animated),body:not(:animated)").animate(
      {
        scrollTop: destination,
      },
      400
    )
    return false
  })

  function isEmail(email, required = false) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (required) {    
      if (email.length < 1) {
        return false
      } else {
        return regex.test(email)
      }
    } else {
      if (email.length > 0) {
        return regex.test(email)
      } else {
        return true
      }
    }

  }
  function showError(input) {
    input.closest(".mainform__input").removeClass("success").addClass("error")
    input.closest(".mainform__input").find(".errortext").show()
  }

  function hideError(input) {
    input.closest(".mainform__input").removeClass("error").addClass("success")
    input.closest(".mainform__input").find(".errortext").hide()
  }

  $(".inn").suggestions({
    token: "072fd7f1c87f20233d4c83a1bd5a4cfa53b19b3e",
    type: "PARTY",
      onSelect: function(suggestion) {
        let inn = Number(suggestion.data.inn)
        $(this).val(inn)
        $('[name="org"]').val(suggestion.value);
      }
    });

  $('.inn').on('change', function () {
     let val = $(this).val();
     console.log('w1');
     console.log('l' + val.length);
      val = val.replace(/\D/g, "");
     if (val.length >= 10) {
       var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
       var token = "072fd7f1c87f20233d4c83a1bd5a4cfa53b19b3e";

       var options = {
         method: "POST",
         mode: "cors",
         headers: {
           "Content-Type": "application/json",
           "Accept": "application/json",
           "Authorization": "Token " + token
         },
         body: JSON.stringify({query: val})
       }

       fetch(url, options)
           .then(response => response.text())
           .then(result => setInnInfo(result))
           .catch(error => console.log("error", error));
     }
  })

  function setInnInfo(result) {
    result = JSON.parse(result);
    console.log(result.suggestions);
      if (result.suggestions.length > 0) {
          hideError($('.inn'));
          $('[name="org"]').val(result.suggestions[0].value);
          hideError($('[name="org"]'))
      } else {
        showError($('.inn'));
      }
  }


  $("form").on("submit", function (e) {
    e.preventDefault()
    let valid = true
    let emailvalid = true

    const $required = $("input.required")
    const $form = $(this)

    $required.each(function () {
     
      console.log($(this).val())
      if ($(this).val().length < 1) {
        showError($(this))
        valid = false
      } else {
        hideError($(this))
      }
    })
    

    $("input.email").each(function () {
      emailvalid = isEmail($(this).val(), $(this).hasClass('required'))
      if (!emailvalid) {
        showError($(this))
      } else {
        hideError($(this))
      }
    })

    if (valid && emailvalid) {
      $("#u-name").text($('[name="name"]').val())
     /*  $.post(
        "/local/ajax/form.landing.php",
        $form.serialize(),
        function (result) {
          console.log("send")
        }
      ) */
      $("#regmodal").modal("show")
      $("form input").each(function () {
        $(this).val("")
      })
    }
  })
})