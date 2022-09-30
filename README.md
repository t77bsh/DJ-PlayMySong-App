# DJ-PlayMySong-App

## Overview:
### Request your favourite songs from the DJ of your event!
If you're at a party or a nightclub, making song requests to the DJ has always been a tedious process. You have to find the DJ booth, push through the crowd then shout the request to the DJ hoping that he hears you on-top of all the loud music and crowd. The Play My Song web app saves all this hassle!

![Meme](frontend/src/images/meme.jpeg "Meme" | width=100)


### Live app: https://t77bsh.github.io/DJ-PlayMySong-App/

## How it works:
Upon opening the app, you're prompted to either join a room or create a room as the DJ.

If you're the DJ, hit 'CREATE ROOM AS DJ' and you'll be taken to your room's dashboard. The dashboard will display your room's invite code and QR code, both of which can be shared with your event's guests allowing them to join. Once guests join, they can submit song requests which will appear on your dashboard under 'Requests'. If none are made, it will display 'Awaiting Requests'. The requests, along with the number of guests in the room, are updated live in real-time.

If you're a guest at an event and the DJ is using Play My Song, then simply input the invite code under the 'Join A Room' heading and you will be taken to the event room. Alternatively, you can use your device's camera app to scan the QR code (if shared) to do the same. Once joined, you will see a prompt that lets you input your song requests and send to the DJ. 

## Built with:
Frontend: React JS, TypeScript, HTML and SCSS (CSS).

Backend: Node.js, Express, Socket.io and Redis.

Backend server deployed using Heroku.
