const express = require("express");
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

//Route 1: create playlist
router.post("/create", passport.authenticate("jwt", {session: false}), 
    async (req, res) => {
        const  currentUser = req.user;
        const {name, thumbnail, songs} = req.body;
        if(!name || !thumbnail || !songs){
            return res.status(301).json({err: "Insufficient data"});
        }

        const playlistData = {
            name, thumbnail,
            songs,
            owner: currentUser._id,
            collaborators: []
        };
        const playlist = await Playlist.create(playlistData);
        return res.status(200).json(playlist);
    }
);

//Route 2: Get a playlist by id
//we get the playlist ID as a route parameter and we will return the playlist having that id.
//If we are doing /playlist/get/:playlistId (focus on the :) --> this means playlistId is now a variable to which we can assign any value.
//If you call anything of the format /playlist/get/ajdhd (ajdhd can be anything), this api is called
//If you called /playlist/get/ajdhd, the playlistId variable gets assigned the value ajdhd
router.get("/get/playlist/:playlistId", passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const playlistId = req.params.playlistId;
        const playlist = await Playlist.findOne({_id: playlistId});
        if(!playlist){
            return res.status(301).json({err: "Invalid ID"});
        }
        return res.status(200).json(playlist);
    }
);


// get all playlists made by an artist
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const artistId = req.params.artistId;

        //check if artist with given artist Id exists
        const artist = await User.findOne({_id: artistId});
        if(!artist){
            return res.status(304).json({err: "Invalid Artist ID"});
        }

        const playlists = await Playlist.find({owner: artistId});
        return res.status(200).json({data: playlists});
    }
);


//add a song to a playlist
router.post("/add/song", passport.authenticate("jwt", {session: false}), 
    async (req, res) => {
        const currentUser = req.user;
        const {playlistId, songId} = req.body;
        //get the playlist if valid
        const playlist = await Playlist.findOne({_id: playlistId});
        if(!playlist){
            return res.status(304).json({err: "Playlist does not exist"});
        }

        //check if currentUser owns playlist or is a collaborator
        if(!playlist.owner.equals(currentUser._id) && !playlist.collaborators.includes(currentUser._id)) {
            return res.status(400).json({err: "Not allowed"});
        }
        //check if the song is a valid song
        const song = await Song.findOne({_id: songId});
        if(!song){
            return res.status(304).json({err: "Song does not exist"});
        }

        // we can now simply add the song to the playlist
        playlist.songs.push(songId);
        await playlist.save();

        return res.status(200).json(playlist);
    }
);


module.exports = router;