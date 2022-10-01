# DJ Play My Song

<img src="frontend/src/images/meme.jpeg" width="240" height="240">


## Overview:
### Request your favourite songs from the DJ of your event!
If you're at a party or a nightclub, making song requests to the DJ has always been a tedious process. You have to find the DJ booth, push through the crowd then shout the request to the DJ hoping that he hears you on-top of all the loud music and crowd. The Play My Song web app saves all this hassle!

Supports multiple users and event rooms simultaneously.


### Live app: https://t77bsh.github.io/DJ-PlayMySong-App/

### Full demo:

https://user-images.githubusercontent.com/100529283/193337673-746bdb4c-c6d8-4654-9719-6d38c39442f2.mov

### Mobile demo using QR code:

https://user-images.githubusercontent.com/100529283/193339557-2a8405f4-37c0-4cb0-a846-c89e293e3e49.MP4

## How it works:
Upon opening the app, you're prompted to either join a room or create a room as the DJ.

If you're the DJ, hit 'CREATE ROOM AS DJ' and you'll be taken to your room's dashboard. The dashboard will display your room's invite code and QR code, both of which can be shared with your event's guests allowing them to join. Once guests join, they can submit song requests which will appear on your dashboard under 'Requests'. If none are made, it will display 'Awaiting Requests'. The requests, along with the number of guests in the room, are updated live in real-time.

If you're a guest at an event and the DJ is using Play My Song, then simply input the invite code under the 'Join A Room' heading and you will be taken to the event room. Alternatively, you can use your device's camera app to scan the QR code (if shared) to do the same. Once joined, you will see a prompt that lets you input your song requests and send to the DJ. 

## Built with:
Frontend: React JS, TypeScript, HTML and SCSS (CSS).

Backend: Node.js, Express, Socket.io and Redis.

Backend server deployed using Heroku.

## Takeaways:
- Learned about WebSockets, its use cases, pros and cons over HTTP requests, and how the technology works to implement bidirectional communication between server and clients.
- Used Socket.IO to keep open and persistent connections between hosts and guests to allow for real-time communication.
- Wrote server-side logic to make sure: multiple event rooms can coexist at the same time, event guests can join their hosts using unique invite codes, event guests are prevented from accessing the host’s admin room, guests’ requests are sent to the correct rooms, guests are removed when host ends event, rooms are only created using the create button and not through the URL.
- Socket IO - gained key skills in knowing how to work with and navigate the documentation of an unfamiliar external library for an original use case.
- Used Redis to store song requests data in-memory to allow for quick retrieval given the real-time nature of the app.
- Used an open-source QR Code API to allow guests to join their hosts using their device's camera.
- Used TypeScript to minimise errors and bugs when deploying to production.
- Learned how JavaScript can be used in the backend too using Node and Express.
- Developed a better understanding of UI and UX by working on a real-life problem.
