function upvote(postId) {
    let votes = parseInt(document.getElementById("votes-" + postId).innerText);
    document.getElementById("votes-" + postId).innerText = votes + 1;
}
