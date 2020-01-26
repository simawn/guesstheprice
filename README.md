# Guess The Price

Definitely not a knock off of The Price is Right :)

Lobby
![](/img/lobby.jpg)
In Game
![](/img/ingame.jpg)

## Inspiration
When our group of friends hangout, we often play games like JackBox, which has games that are super fun and easy to setup. All you need is the Internet and your phone. Our goal was to make something similar that you could just jump in and play something fun and interesting.

## What it does
The game is quite simple. You need to guess the price of an item from Amazon. Just like JackBox, you can create a room which would allow you to invite your friends through a unique code. Once everyone is ready, you can start the game. Everyone is given the name of the product with its image and whoever guesses closest to the actual price wins that round!

## How we built it
Our idea was to use Google's real time db so that all players would be updated when the state of the game changes. This way there would be no way to mess with the game and no real need for a backend. The frontend was made in React and Redux.

## Challenges we ran into
Our initial idea was to use Amazon's ItemSearch API, but there were many restrictions that made this impossible (Being an associate, having confirmed sales, etc). Therefore, our next option was just to scrape the data ourselves, which was still a challenge, because all our serverside functions would need to be inside Cloud Functions (Google's lambdas) since we were using the real-time db (Firebase). This made a lot of node modules crash or just not work.

## Accomplishments that we are proud of
We managed to build a game that we will be able to play with friends and family which we're sure they will enjoy.

## What we learned
We learned that Firebase is a completely different platform than the traditional backend/db stacks and that even though it does a lot and is very user-friendly, it has many gotchas when coming from the standard server-side technologies.

## What's next for Guess The Price
The next step would be to improve the UI, lots of user validation, more items, possibly implement the backend with websockets,... lots of stuff