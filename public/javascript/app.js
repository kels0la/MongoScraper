$(document).ready(()=> {
  //Scrapes the articles then adds them to the #articles div. 
  $(".scrape-new").on("click", () => {
      $.ajax({
        method: "GET",
        url: "/scrape"
      })
      .then((data) => {
        $.getJSON("/articles", function(data) {
          for (let i = 0; i < 10; i++) {
            if (data[i].saved === false){
              $("#articles").append(`<p><a href="http://www.yours.org${data[i].link}"><b>Article: </b>${data[i].title}</a><br><b>Author:</b> ${data[i].author}<br><b>Total earned:</b> ${data[i].amount}<br><a class="btn btn-success save" data-id='${data[i]._id}'>Save Article</a></p>`)
            }
          }
        });
      });
  });
  //grabs the articles if they already exist in the database
  $.getJSON("/articles", function(data) {
    for (let i = 0; i < 10; i++) {
        $("#articles").append(`<p><b>#${i+1}</b><br><a href="http://www.yours.org${data[i].link}"><b>Article: </b>${data[i].title}</a><br><b>Author:</b> ${data[i].author}<br><b>Total earned:</b> ${data[i].amount}<br><a class="btn btn-success save" data-id='${data[i]._id}'>Save Article</a></p>`)
    }
  });
  //grabs only the saved articles in the database
  $.getJSON("/savedarticles", (data) => {
    for (let i = 0; i < data.length; i++){
      $("#savedArticles").append(`<p><b>#${i+1}</b><br><a href="http://www.yours.org${data[i].link}"><b>Article: </b>${data[i].title}</a><br><b>Author:</b> ${data[i].author}<br><b>Total earned:</b> ${data[i].amount}<br><a class="btn btn-success note" data-target="#myModal" data-toggle="modal" data-id='${data[i]._id}'>Notes</a> <a class="btn btn-success delete" data-id='${data[i]._id}'>Delete</a></p>`)
    }
  });
  //Marks an article as saved
  $(document).on("click", ".save", (element) => {
    
    const thisId = element.target.dataset.id
    
    $.ajax({
      method: "GET",
      url: "/marksaved/" + thisId
    }).then((data) => {
      console.log(data);
      window.location.reload(true);
    });
  });
  //deletes a saved article from the database
  $(document).on("click", ".delete", (element) => {
    
    const ID = element.target.dataset.id
    console.log(ID);
    $.ajax({
      method: "PUT",
      url: "/delete/" + ID
    }).then((data) => {
      console.log(data);
      window.location.reload(true);
    });
  });
  //empties out the articles div
  $(".clear").on("click", () => {
    $("#articles").empty();
  });
  
  let IDofArticle = null //Needed so it doesn't continue to add an extra call on click of the note (submits note multiple times without it)
  $(document).on("click", ".note", (element) => {
    element.preventDefault();
    let articleID = element.target.dataset.id
    console.log(articleID);
    $.ajax({
      method: "GET",
      url: "/savedarticles/" + articleID
    }).then((data) => {
      $('.articleNotes').empty();
      console.log(data[0])
      let notes = data[0].note;

      $(".articleName").html(`Notes for: "${data[0].title}"<p></p><h6>By: ${data[0].author}</h6>`);
      if (notes.length > 0) {
        $('.articleNotes').empty();
        for (let i = 0; i < notes.length; i++) {
          let button = (`<a><button type="button" data-id="${notes[i]._id}" class="close" data-dismiss="modal">&times;</button></a>`)
          // '<a class href=/deleteNote/' + notes[i]._id + '><button type="button" class="close">&times;</button></a>';
          $('.articleNotes').append('<div class="panel panel-default"><div class="noteText panel-body">' + notes[i].text + button + '</div></div>');
        }
      } else {
        $('.articleNotes').html("No notes for this article yet");
      }
      IDofArticle = articleID
    });
  });

  //Deleting a Note
  $(document).on("click", ".close", function (element) {
    console.log(element.target);
    let noteID = element.target.dataset.id
    console.log(noteID);
    $.ajax({
      method: "PUT",
      url: "/deleteNote/" + noteID
    }).then((data) => {
      console.log(data);
      modal.location.reload(true);
    });
  });

    //Adding a note
  $(".submitNote").on("click", (event) => {
    console.log(IDofArticle);
    event.preventDefault();
    let noteText = $("#theNotes").val().trim();
    
    $.ajax({
      method: "POST",
      url: "/notes/" + IDofArticle,
      data: {
        text: noteText
      }
    }).then((data) => {
      $("#theNotes").val("");
    });
  });
});  