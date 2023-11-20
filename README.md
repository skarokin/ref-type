# ref-type
First full-stack project

Used this amazing repository https://github.com/gionathas/speed-typing to set up the base typing game logic (I'm not very good with React). I then modified it to feel more natural, i.e. monkeytype-esque.

# immediate-concerns
1. `generatedWords` and `typedCharacters` DOES properly word break, however `typedCharacters` word breaks only when the current word requires it
   - Suppose one line of `generatedWords` forced a wordbreak when the last word is 5 characters long
   - This works properly in `generatedWords` - it's already 5 characters long!
   - However, the word at `typedCharacters` will continue to be appended to some empty space until it reaches 5 characters long
   - **FIRST IDEA :** tried mapping `typedCharacters` to `generatedWords`, finding how far away the next white space is from `generatedWords[typedCharacters]` then appending white spaces to `typedCharacters`, but it didn't work well
   - **POTENTIAL FIX :** split `generatedWords` into lines of 3, ensuring that each line only contains FULL words (how to ensure it only contains full words..?) Then, perform our mapping of `typedCharacters` to `generatedWords` as usual, just separated by line. `IF typedCharacters === line.length THEN moveToNextLine`.. `IF typedAllLines THEN generateNewWords`
2. Errors can be reversed
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
