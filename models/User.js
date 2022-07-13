const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: 'string',
        required: [true, 'Email is required'],
        unique: true
    },
    passwd: {
        type: 'string',
        required: [true, 'Password is required'],
    }
});

//helpful functions: encrypt password
UserSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
});

//helpful functions: compare passwords
UserSchema.methods.comparePassword = function(plaintText, callback)  {
    return callback(null, bcrypt.compareSync(plaintText, this.password));
}

module.exports = mongoose.model('User', UserSchema);