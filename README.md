# ref-type
First full-stack project

Used this amazing repository https://github.com/gionathas/speed-typing to set up the base typing game logic (I'm not very good with React). It is heavily modified to fit my needs, but I give massive credit for being my starting point.

# immediate-concerns
1. Cannot set time (15s/60s is what i want)
2. Make login and register form pretty!

# to-be-done
1. Allow user logins and signups
   - Use Node's `scrypt` to hash and salt passwords  
   - Create a component for users to sign up/login
      - If not signed in, only display "log in/sign up"
      - If signed in, show a drop-down menu containing their top 15s and 60s scores, and a logout button 
2. Store user info (userID, best15, best60)
   - Ensure that user info is only stored if a user is logged in
   - This means I should create a session for the user when logged in, destroying it on logout or page close
3. Display leaderboard (top 100 in 15s, top 100 in 60s)
