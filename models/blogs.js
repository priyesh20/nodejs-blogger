const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    upVote: {
        type: Number,
        required: true
    },
    upVoters: {
        upVotersInfo: [{
            upVoteBoolean: { type: Boolean },
            upVoteUserId: { type: Schema.Types.ObjectId , ref: 'user' }
        }]
    },
});

blogSchema.statics.upVoteCal = function(blog, userId){
    // console.log(blog);
    console.log(userId);
    const upVotersIndex = blog.upVoters.upVotersInfo.findIndex(uvInfo => {
        return uvInfo.upVoteUserId.toString() === userId.toString();
    });
    const updatedUpVoters = [...blog.upVoters.upVotersInfo];
    console.log(upVotersIndex);
    if(upVotersIndex >=0){
        if(updatedUpVoters[upVotersIndex].upVoteBoolean === true){
            blog.upVote -= 1;
            updatedUpVoters[upVotersIndex].upVoteBoolean = false;
        } else {
            blog.upVote += 1;
            updatedUpVoters[upVotersIndex].upVoteBoolean = true;
        }
    }else{
        blog.upVote += 1;
        updatedUpVoters.push({
            upVoteBoolean: 'true',
            upVoteUserId: userId
        })
        blog.upVoters.upVotersInfo = updatedUpVoters;
    }
    return blog.save();
}

module.exports = mongoose.model('Blog', blogSchema);