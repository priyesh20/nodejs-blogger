const voting = (btn) => {
    const blogId = btn.parentNode.querySelector('[name=blogId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const upVote = btn.parentNode.querySelector('[class=upVote]');

    fetch('/upVote/'+ blogId,{
        method: 'POST',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json();
    })
    .then(data => {
        upVote.textContent = data.upVoteCount;
    })
    .catch(err => {
        console.log(err);
    });
}