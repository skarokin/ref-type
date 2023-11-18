# ref-type
first full-stack project

much of the code for the typing game logic taken from https://www.youtube.com/watch?v=oc7BMlIU3VY

# immediate-issues
1. transitioning from one set of words to another SUCKS! Super unsmooth and natural instinct is to press spacebar but you can't after transition
2. some words from faker library have a hyphen; this is a forbidden character!
3. line-wrap instead of line-break if word is too long
4. cannot set time (15s/60s is what i want)
5. no wpm stat
6. the caret isn't very well implemented - it's better to calculate correct caret position at each new set of words 
7. its fricking ugly

# to-be-done
1. allow user logins and signups
2. store user info (userID, best15, best60)
3. display leaderboard (top 100 in 15s, top 100 in 60s)