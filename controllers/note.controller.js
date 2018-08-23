
const Notes = require('../models/note.model')

exports.create = (req, res) => {
    if(!req.body.content){
        return res.status(400).send({
            message: "u have got nothing"
        })
    }

    const note = new Notes({
        title: req.body.title || "Untitled one",
        content: req.body.content
    });

    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send({
            message: err.message
        })
    })
};

exports.findAll = (req, res) => {
    Notes.find()
    .then(notes =>{
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

// retriving single note:

exports.findOne = (req, res) => {
    Notes.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "note not found"
            })
        }
        res.send(note)
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: " Note not found with ID" + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Error" +req.params.noteId
        });
        
    })
}

// export.update = (req, res) => {
//     if(!req.body.content) {
//         return res.status(400).send({
//             message: "Note content can not be empty"
//         })
//     }

//     //Find the note and make the update
//     Note.findByIdAndUpdate(req.param)
// }