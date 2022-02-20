var mongoose = require('mongoose');

const QuestionAnswerSchema = mongoose.Schema({
    QAId: "string",
    userId: "string",
    question: "string",
    answer: "string",
    QAstatus: "string"
});

var QuestionAnswer = module.exports = mongoose.model('QuestionAnswer', QuestionAnswerSchema);