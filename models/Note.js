var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var Noteschema = new Schema({
    text: {
        type: String,
    }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", Noteschema);

// Export the Article model
module.exports = Note;
