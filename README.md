# ref-type
first full-stack project

much of the code for the typing game logic taken from https://www.youtube.com/watch?v=oc7BMlIU3VY

# immediate-issues
1. generatedWords and typedCharacters DOES properly word break, however typedCharacters word breaks only when the current word requires it
- - Suppose one line of generatedWords forced a wordbreak when the last word is 5 characters long
  - This works properly in generatedWords - it's already 5 characters long!
  - However, the word at typedCharacters will continue to be appended to some empty space until it reaches 5 characters long 
3. cannot set time (15s/60s is what i want)
4. no wpm stat (this should be pretty easy to implement)

# to-be-done
1. allow user logins and signups
2. store user info (userID, best15, best60)
3. display leaderboard (top 100 in 15s, top 100 in 60s)
