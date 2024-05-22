const mongoose = require('mongoose')
//mongo db database
const Password = process.argv[2]
const url  = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
    
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                // Check if the hyphen is at the second or third position
                const hyphindex = v.indexOf('-')
                if (hyphindex !== 2 && hyphindex !== 3) {
                    return false
                }

                // Split the number into parts before and after the hyphen
                const beforeHyphen = v.substring(0, hyphindex)
                const afterHyphen = v.substring(hyphindex + 1)

                // Ensure both parts are numeric and that there is only one hyphen
                if (!/^\d+$/.test(beforeHyphen) || !/^\d+$/.test(afterHyphen)) {
                    return false
                }

                // Ensure the entire string only contains one hyphen
                if (v.split('-').length !== 2) {
                    return false
                }

                return true
            },
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person