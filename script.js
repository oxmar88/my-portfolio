let posts = []; // create an empty array to store all the posts

const postForm = document.getElementById("create-post-form"); 
const postText = document.getElementById("post-text")
const usernameInput = document.getElementById("username");

function makePost(event) {
  event.preventDefault(); // preventing page reload after submission

  let username = usernameInput.value;
  const postTextContent = postText.value; 

  if (postTextContent === "") { // to make sure some sort of text is entered this is also validated in html form where i put required attribute
    alert("You need to enter Z text");
    return;
  }

  if (username === "") {  // if username is empty, use "Anonymous"
    username = "Anonymous";
  }

  const post = { // create the post object
    username: username,
    text: postTextContent,
    likes: 0,
    replies: [], // empty array for replies for later
    time: new Date() // to get the timestamp of the post cited in read me got it from https://www.w3schools.com/js/js_date_methods.asp
  };

  posts.push(post); 

  postText.value = ""; // clearing text area as tasked for next input 

  display(); // calling display function created below to show the posts 
}

function display() {

  const displayPosts = document.getElementById("display-posts");
  displayPosts.innerHTML = ""; // clearing post text area as tasked 

  let allPostsHTML = ""; // will collect all posts html then be appeneded at the end

  for (let index = 0; index < posts.length; index++) { //looping through out posts array and addin all required features and buttons 
    const post = posts[index]; // get the post for the current index

    // i made ids with the index attached so i can access later exact posts rather than giving all of them the same ID 
    let postHTML = 
    `<div class="post">

        <div class="post-header">
          <em><strong>${post.username}</strong></em> | ${post.time} 
        </div>

        <div class="post-text">
          ${post.text}
        </div>

        <div class="post-actions">
          <button class="like-button" id="like-${index}">Like (${post.likes})</button> 
          <button class="reply-button" id="reply-${index}">Reply</button>
          <button class="delete-button" id="delete-${index}">Delete</button>
        </div>
    `; // leaving div open for replies that we will add 

    if (post.replies.length > 0) { // to check if there are replies in our array 
        postHTML += `<div class="post-replies">`;
        
        for (let rIndex = 0; rIndex < post.replies.length; rIndex++) {
          const reply = post.replies[rIndex];


          //the emoji is taken from https://emojipedia.org/left-arrow-curving-right
          postHTML += `
            <div class="reply">
               
              ↪️ <em><strong>${reply.username} : </strong></em> ${reply.text} 
              <button class="like-reply-button" id="like-reply-${index}-${rIndex}">Like (${reply.likes})</button>
              <button class="delete-reply-button" id="delete-reply-${index}-${rIndex}">Delete</button>

            </div>`;
        }

        postHTML += `</div>`;
    }

    postHTML += `</div>`; // close main post div

    allPostsHTML += postHTML; // add to our full html string which will be printed after adding evyerhting 
  }

  displayPosts.innerHTML = allPostsHTML; // after all posts built as needed append it to page( this took forever to figure out and caused many errors)

  for (let index = 0; index < posts.length; index++) { // seperate loop to add event listeners for each post 

    document.getElementById(`like-${index}`).addEventListener("click", function () { 
      posts[index].likes++;
      display(); // re displaying after update added in all event listners below 
    });

    document.getElementById(`reply-${index}`).addEventListener("click", function () {
      const replyText = prompt("Enter your reply:"); // prompt function cited in read me from https://www.w3schools.com/jsref/met_win_prompt.asp
      let replyUsername = prompt("Enter your username for the reply:"); // prompt function cited in read me from https://www.w3schools.com/jsref/met_win_prompt.asp

      if (replyUsername === "") { // just like in normal posts 
        replyUsername = "Anonymous";
      }

      if (replyText) { 
        const replyObject = {
          username: replyUsername,
          text: replyText,
          likes: 0
        };
        posts[index].replies.push(replyObject); 
        display();

      }
    });

    document.getElementById(`delete-${index}`).addEventListener("click", function () {
        for (let i = index; i < posts.length - 1; i++) {
            posts[i] = posts[i + 1]; // shift everything to the left as we are using an array 
        }
        posts.pop(); // removing the last item that we want deleted 
        display(); 
    });

   
    for (let r = 0; r < posts[index].replies.length; r++) {  // adding the reply like and delete buttons with event listeners
      const likeReplyBtn = document.getElementById(`like-reply-${index}-${r}`);
      const deleteReplyBtn = document.getElementById(`delete-reply-${index}-${r}`);

      if (likeReplyBtn) {
        likeReplyBtn.addEventListener("click", function () {
          posts[index].replies[r].likes++;
          display();
        });
      }

      if (deleteReplyBtn) {
        deleteReplyBtn.addEventListener("click", function () {
          for (let j = r; j < posts[index].replies.length - 1; j++) {
            posts[index].replies[j] = posts[index].replies[j + 1];
          }

          posts[index].replies.pop();
          display();
        });
      }
    }
  }
}

postForm.addEventListener("submit", makePost); 
display();




//search functionality

function search(term) {

    term = term.toLowerCase(); // to remove case senstivity 
  
    if (term === "") {
      display(); 
      return;
    }
  
    const originalPosts = []; // to store and display original posts 
    for (let i = 0; i < posts.length; i++) {
      originalPosts.push(posts[i]);
    }
  
    const matching = []; // what we searched for 
  
    for (let i = 0; i < originalPosts.length; i++) {
      const post = originalPosts[i];
      const postText = post.text.toLowerCase();

        if (postText.includes(term)) {
            matching.push(post);
        }
    }
  
    if (matching.length === 0) {
      document.getElementById("display-posts").innerHTML =
        `<p>No posts found with the term <strong>${term}</strong>.</p>`;
      return;
    }
  
    posts = matching;
    display();
    posts = originalPosts;
  }

document.getElementById("search-input").addEventListener("input", function () {
    let id = document.getElementById("search-input").value;
    search(id);
  });