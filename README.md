# ref-type
First full-stack project

Used this amazing repository https://github.com/gionathas/speed-typing to set up the base typing game logic (I'm not very good with React). It is heavily modified

# immediate-concerns
1. After fixing word-break issue, Caret is always stuck at the end of each word (duh)
   - **IDEA:** I can instead make Caret track "totalTyped" (which is already in `useTyping.tsx`)
3. Errors can be reversed
   - Instead, everytime an error is made, it should be added to an "error counter" which does not change even if the typer reverses the change
   - This is used for proper calculation of WPM!
4. Cannot set time (15s/60s is what i want)
5. No wpm stat (this should be pretty easy to implement)
   - **TRUE WPM :** $\frac{totalCorrect}{5}$, normalized to 60 seconds
   - **RAW WPM :** $\frac{totalTyped}{5}$, normalized to 60 seconds

# to-be-done
1. Allow user logins and signups
   - I should make my own user auth system... ensure security using HTTPS and salt/hash
   - Create a component for users to sign up/login
      - Once signed in, component should have a drop-down menu containing their top 15s and 60s scores, and a logout button 
2. Store user info (userID, best15, best60)
   - Ensure that user info is only stored if a user is logged in
   - This means I should create a session for the user when logged in, destroying it on logout or page close
3. Display leaderboard (top 100 in 15s, top 100 in 60s)
