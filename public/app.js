// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].titleInfo + "<br />" + data[i].linkInfo + "</p>");
//   }
// });


// Whenever someone clicks a p tag
// $(document).on("click", ".comments", function () {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");
//   console.log("clicked")
//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })

//     .then(function (data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.titleInfo + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       // if (data.note) {
//       //   // Place the title of the note in the title input
//       //   $("#titleinput").val(data.note.title);
//       //   // Place the body of the note in the body textarea
//       //   $("#bodyinput").val(data.note.body);
//       // }

//       // console.log(data.note)

//       // data.note.forEach(element => {

//       //   var newDiv = $("<div>")

//       //   var titleH2 = $("<h2>")

//       //   var pBody = $("<p>")

//       //   var button = $('<button type="button" class="btn btn-danger">Danger</button>')

//       //   button.attr("note-id", element._id)

//       //   button.attr("article-id", data._id)

//       //   titleH2.html(element.title)

//       //   pBody.html(element.body)

//       //   newDiv.append(titleH2)

//       //   newDiv.append(pBody)

//       //   newDiv.append(button)

//       //   $("#notes").append(newDiv)

//       // });
//     });
// });

$(document).on("click", ".btn-danger", function () {
  console.log("clicked delete")
  var noteID = $(this).attr("note-id")

  //grabs the article's ID from the url. Could not hardcode the id in the {{each}} block that generates the notes
  var pathway =  window.location.pathname.split('/');


  $.ajax({
    url: '/note/' + pathway[1] + "/" + noteID,
    type: 'DELETE',
  })
    .then(function(data){
      location.reload()
    })

})

$(document).on("click", ".scrape", function () {
  $("#articles").empty()

  var h2scrape = $("<h2>")

  h2scrape.text("Page will automatically reload once scraping has completed")

  $("#articles").append(h2scrape)

  $.ajax({
    url: '/scrape/',
    type: 'GET',
  })
    .then(function (data) {
      location.reload();
    });

})


// When you click the savenote button
$(document).on("click", "#savenote", function () {
  event.preventDefault()
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      location.reload();

      // console.log(data);
      // $("#titleinput").val("");
      // $("#bodyinput").val("");
      // // Empty the notes section

    });

  // Also, remove the values entered in the input and textarea for note entry

});
