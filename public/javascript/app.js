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
  
  let IDofNote = null //Needed so it doesn't continue to add an extra call on click of the note (submits note multiple times without it)
  $(document).on("click", ".note", (element) => {
    element.preventDefault();
    let noteID = element.target.dataset.id
    console.log(noteID);
    $.ajax({
      method: "GET",
      url: "/savedarticles/" + noteID
    }).then((data) => {
      $(".articleName").html(`Notes for: "${data[0].title}"<p></p><h6>By: ${data[0].author}</h6>`);
      if (data[0].note) {
        $(".articleNotes").html(`Note: ${data[0].note.text}`);//Adding notes from the database assigned to this article
      }
      IDofNote = noteID
    });
  });
  
    $(".submitNote").on("click", (event) => {
      console.log(IDofNote);
      event.preventDefault();
      
      let noteText = $("#theNotes").val().trim();
      console.log(noteText);//We then take this note text and add it to the database assigned by the ID.
      $.ajax({
        method: "POST",
        url: "/savedarticles/" + IDofNote,
        data: {
          text: noteText
        }
      }).then((data) => {
        $("#theNotes").val("");
      });
    
    });
  
});  