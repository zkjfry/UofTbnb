"use strict";
require('dotenv').config()
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const log = console.log;
const express = require("express");
const bodyParser = require("body-parser"); // middleware for parsing HTTP body
const app = express();
const cors = require('cors')
const { ObjectID } = require("mongodb");
const path = require("path");
const bcrypt = require("bcrypt")
const User = require("./models/user.js");
const House = require("./models/house");
const Reserve = require("./models/reserve.js");
const Roommate = require("./models/roommate.js");
const Review = require("./models/review")
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
const db = require("./mongoose").connect();
const port = process.env.PORT || 5000;
cloudinary.config({
	cloud_name: "di97vw9om", 
	api_key: 164636392665182, 
	api_secret: "LbibdpoWQj1UV5NnpHZ1wzQyESQ"
})
app.use(formData.parse())
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files


app.use(formData.union());
app.listen(port, () => {
	log("Listening on port 5000...");
});

app.get("/allrequest_info/:id", (req, res) => {
	const id = req.params.id
	Reserve.find({receiver_id: id}).then(requests => {
		requests = requests.filter(item => item.approved === false)
		res.send(requests)
	}).catch(error => res.send(error))
})

app.get("/allroommate", (req, res) => {
	Roommate.find().then(roommates => {
		console.log(roommates)
		let holder = [0,0,0,0,0,0,0,0]
		roommates = roommates.filter(item => item.approved === true)
		console.log(roommates)
		roommates.forEach(element => {
			if (element.location === "Downtown Toronto"){
				holder[0] += 1
			}
			else if (element.location === "Mississagua"){
				holder[1] += 1
			}
			else if (element.location === "North York"){
				holder[2] += 1
			}
			else if (element.location === "Scarbourough"){
				holder[3] += 1
			}
			else if (element.location === "Brampton"){
				holder[4] += 1
			}
			else if (element.location === "Vaughan"){
				holder[5] += 1
			}
			else if (element.location === "Richmond Hill"){
				holder[6] += 1
			}
			else if (element.location === "Markham"){
				holder[7] += 1
			}
		})
		res.send([holder, roommates])
	}).catch(error => res.send(error))
})

app.get("/get_request/:id", (req, res) => {
	const id = req.params.id
	Reserve.find({receiver_id: id}).then(data => {
		res.send(data)
	})
})


app.get("/location_info/:loc", (req, res) => {
	const location = req.params.loc
	House.find({city: location}).then(houses => {
		houses = houses.filter(item => item.approved === true)
		if (houses.length == 0){
			res.send([])
		}
		else{
			res.send(houses)
		}
	}).catch(error => res.send(error))
})

app.post("/approverequest", (req, res) => {
	const request = req.body.request
	//TODO: Make sure the request is approved, add it to user's list
	if (request.reserve_type === "house"){
		House.findByIdAndUpdate(request.info_id, {
			inprogress: 1, 
			current_teneant: request.sender_id,
			}).then(res => {
				Reserve.findByIdAndUpdate(request._id, {
					approved: true
				}).then(res => console.log(res)).catch(error => console.log(error))
			console.log(res)
		}).catch(error => res.send(error))
	}
	else if (request.reserve_type === "roommate"){
		Roommate.findByIdAndUpdate(request.info_id, {
			current: request.sender_id
		}).then(
			roommate => res.send(roommate)
		).catch(error => res.send(error))
	}
})

app.post("/rejectrequest", (req, res) => {
	const request = req.body.request
	//TODO: Make sure the request is rejected, and we delete it to the user's list
})

app.get("/requesting/:id", (req, res) => {
	const id = req.params.id
	Reserve.find({receiver_id: id}).then(requests => {
		let userid = []
		requests = requests.filter(item => item.approved == false)
		requests.forEach(element => {
			userid.push(element.sender_id)
		});
		res.send([requests, userid])
	}).catch(error => {
		res.send(error)
	})
})

app.get("/allhouseinfo/:id", (req, res) => {
	House.find({}).then(houses => {
		const holder = [0,0,0,0,0,0,0,0,0,0,0,0]
		houses = houses.filter(item => item.approved == true)
		houses.forEach(element => {
			if (element.housetype === "Apartment"){
				holder[0] += 1
			}
			else if (element.housetype === "House"){
				holder[1] += 1
			}
			else if (element.housetype === "Basement"){
				holder[2] += 1
			}
			else{
				holder[3] += 1
			}
			if (element.city === "Downtown Toronto"){
				holder[4] += 1
			}
			else if (element.city === "Mississagua"){
				holder[5] += 1
			}
			else if (element.city === "North York"){
				holder[6] += 1
			}
			else if (element.city === "Scarbourough"){
				holder[7] += 1
			}
			else if (element.city === "Brampton"){
				holder[8] += 1
			}
			else if (element.city === "Vaughan"){
				holder[9] += 1
			}
			else if (element.city === "Richmond Hill"){
				holder[10] += 1
			}
			else if (element.city === "Markham"){
				holder[11] += 1
			}
		}
		)
		Reserve.find({receiver_id: req.params.id}).then(reservations => {
			reservations = reservations.filter(item => item.approved == false)
			res.send([holder,houses,reservations])
		})
	}).catch(error => console.log(error))
})

app.post("/Image/SaveImage", (req, res) => {
	const values = Object.values(req.files)
	const promise = values.map(image => cloudinary.uploader.upload(image.path))
	Promise
		.all(promise)
		.then(result => {
			console.log(result)
			let urls = []
			let ids = []
			result.forEach(element => {
				urls.push(element.url)
				ids.push(element.public_id)
			});
			res.send([urls, ids])
		})
		.catch(error => console.log(error))
});
app.post("/Image/DeleteImage", (req, res) => {
	const picture_ids = req.body.picture_ids
	console.log(req.body)
	const promise = picture_ids.map(id => cloudinary.uploader.destroy(id))
	Promise
		.all(promise)
		.then(result => {
			console.log(result)
		})
})
app.post("/Review/CreateReview", (req, res) => {
	console.log(req.body)
	const house_id = req.body.house_id
	const user_id = req.body.user_id
	const number = req.body.rating
	const description = req.body.comment
	const review = new Review({
		user_id: user_id,
		rating: number,
		comment: description
	})
	review
		.save()
		.then(review => {
			House.findByIdAndUpdate(house_id, {$push: {reviews: review._id}})
				.then(house => {
					console.log("review saved for house" + house)
				})
				.catch(err => {
					console.log(err => console.log(err))
				})
			User.findByIdAndUpdate(user_id, {$push: {reviews: review._id}})
				.then(User => {
					console.log("review saved for user" + user)
				})
				.catch(err => {
					console.log(err => console.log(err))
				})
		})
		.catch(err => console.log(err))
})

app.get("/usering/:id", (req, res) => {
	House.find().then(house => {
		// const id = req.params.id
		// let list = []
		// let tmp2 = []
		// let tmp3 = []
		// let tmp4 = []
		// let tmp5 = []
		// for(let i = 0; i < house.length; i++){
		// 	if(house[i].current_teneant === id){
		// 		tmp2.push(house[i])
		// 	} else if(house[i].past_teneant === id){
		// 		tmp3.push(house[i])
		// 	} else if(house[i].owner === id && (house[i].inprogress === 0 || house[i].inprogress === 1)){
		// 		tmp4.push(house[i])
		// 	} else if(house[i].owner === id && house[i].inprogress === 2){
		// 		tmp5.push(house[i])
		// 	}
		// }
		// list.push(tmp2)
		// list.push(tmp3)
		// list.push(tmp4)
		// list.push(tmp5)
		res.send([])
	}).catch(err => console.log(err))
})
app.get("/Review/GetReviewForHouse/:houseid", (req, res) => {
	const houseid = req.params.houseid
	House.findById(houseid)
		.then(house => {
			const reviews = house.reviews
			if(reviews.length === 0){
				res.send([[],[],house])
			}
			else{
				Review.find({
					_id: {$in: reviews}
				})
					.then(docs => {
						let userid = []
						docs.forEach(element => {
							userid.push(element.user_id)
						})
							User.find({
								_id: {$in: userid}})
								.then(data => {
									res.send([data, docs, house])
								})
								.catch(err => {console.log(err)})
						})
					.catch(err => console.log(err))
			}

		})
		.catch(err => console.log(err))

})

app.get("/filtergenroommate/:location", (req, res) => {
	const location = req.params.location
	Roommate.find({location: location}).then(roommates => {
		roommates = roommates.filter(item => item.approved === true)
		res.send(roommates)
	}).then(error => res.send(error))
})


app.post("/filterroommate", (req, res) => {
	const filter_info = req.body.filter
	console.log(filter_info)
	Roommate.find({
		pets_friendly: filter_info[1], 
		smoking: filter_info[2], 
		location:filter_info[3], 
		cooking_level: filter_info[12], 
		socialization_level: filter_info[13],
		friendly_level: filter_info[14],
		cleanliness: filter_info[15], 
		noisy_extent: filter_info[16]
	}).then(roommates => {
		roommates = roommates.filter(item => item.approved === true)
		let valid = []
		let timeconstraint = []
		for (let i = 0; i < 4; i++){
			let time = filter_info[6+i].split(":")
			time[0] = parseInt(time[0])
			time[1] = parseInt(time[1])
			time = time[0] * 60 + time[1]
			timeconstraint.push(time)
		}
		roommates.forEach(item => {
			let wakeup_time = item.wakeup_time
			wakeup_time = wakeup_time.split(":")
			wakeup_time[0] = parseInt(wakeup_time[0])
			wakeup_time[1] = parseInt(wakeup_time[1])
			wakeup_time = wakeup_time[0] * 60 + wakeup_time[1]
			let sleep_time = item.sleep_time
			sleep_time = sleep_time.split(":")
			sleep_time[0] = parseInt(sleep_time[0])
			sleep_time[1] = parseInt(sleep_time[1])
			sleep_time = sleep_time[0] * 60 + sleep_time[1]
			if (wakeup_time >= timeconstraint[0] && wakeup_time <= timeconstraint[1] && sleep_time >= timeconstraint[2] && sleep_time <= timeconstraint[3]){
				// make sure time falls within
				if (parseInt(item.age) >= filter_info[4] && parseInt(item.age) <= filter_info[5]){
					// make sure age falls within
					let startdate = new Date(filter_info[10][0],filter_info[10][1],filter_info[10][2])
					let end_date = new Date(filter_info[11][0], filter_info[11][1]-1, filter_info[11][2])
					let ava_startdate = new Date(item.start_date[0], item.start_date[1]-1, item.start_date[2])
					let ava_enddate = new Date(item.end_date[0], item.end_date[1]-1, item.end_date[2])
					console.log(startdate)
					console.log(ava_startdate)
					if (ava_startdate <= startdate && ava_enddate >= end_date){
						// make sure start time falls within
						if (filter_info[0] === "Dont"){
							valid.push(item)
						}
						else{
							if (filter_info[0] === item.gender){
								valid.push(item)
							}
						}
					}
				}
			}
		})
		res.send(valid)
	})
})


app.post("/filter_houseinfo", (req,  res) => {
	const info = req.body.filter_info
	const send_back = res
	House.find({housetype: info[0]}).then(res => {
		res = res.filter(item => item.approved === true)
		let lower_bound = parseInt(info[2])
		let upper_bound = parseInt(info[3])
		let tmp = []
		for (let i = 0; i < res.length; i++){
			if (res[i].price >= lower_bound && res[i].price <= upper_bound){
				if (res[i].city === info[1]){
					let startdate = new Date(info[4][0],info[4][1],info[4][2])
					let end_date = new Date(info[5][0], info[5][1], info[5][2])
					let ava_startdate = new Date(res[i].start_date[0], res[i].start_date[1]-1, res[i].start_date[2])
					let ava_enddate = new Date(res[i].end_date[0], res[i].end_date[1]-1, res[i].end_date[2])
					console.log(startdate)
					console.log(end_date)
					console.log(ava_startdate)
					console.log(ava_enddate)
					if (ava_startdate <= startdate && ava_enddate >= end_date){
						tmp.push(res[i])
					}
				}
			}
		}
		console.log(tmp)
		send_back.send(tmp)
	}).catch(error => console.log(error))
})
app.get("/Users/GetAllUsers", (req, res) => {
	User.find()
		.then(user => res.send(user))
		.catch(err => console.log(err))
})
app.get("/House/GetAllHouses", (req, res) => {
	House.find({})
		.then(house => res.send(house))
		.catch(err => console.log(err))
})

app.get("/user/all/:id", (req, res) => {
	House.find().then((house) => {
		const id = req.params.id
		let list = []
		let tmp2 = []
		let tmp3 = []
		let tmp4 = []
		let tmp5 = []
		for(let i = 0; i < house.length; i ++){
			if(house[i].current_teneant === id){
				tmp2.push(house[i])
			} else if(house[i].past_teneant === id){
				tmp3.push(house[i])
			} else if(house[i].owner === id && (house[i].inprogress === 0 || house[i].inprogress === 1)){
				tmp4.push(house[i])
			} else if(house[i].owner === id && house[i].inprogress === 2){
				tmp5.push(house[i])
			}
		}
		list.push(tmp2)
		list.push(tmp3)
		list.push(tmp4)
		list.push(tmp5)
		res.send(list)
	}).catch(err => console.log(err))
})

app.get("/Roommate/GetAllRoomates", (req, res) => {
	Roommate.find()
		.then(roommate => res.send(roommate))
		.catch(err => console.log(err))
})
app.post("/House/CreateHouse",(req, res) => {
	const house = new House({
		owner: req.body.owner,
		owner_name: req.body.owner_name,
		housetype: req.body.housetype,
		spacetype: req.body.spacetype,
		bathroom_num: req.body.bathroom_num,
		toilet_number: req.body.toilet_number,
		kitchen_number: req.body.kitchen_number,
		bed_number: req.body.bed_number,
		amenities: req.body.amenities,
		address: req.body.address,
		apt_number: req.body.apt_number,
		city: req.body.city,
		prov: req.body.prov,
		country: req.body.country,
		zip_code: req.body.zip_code,
		price: req.body.price,
		description: req.body.description,
		picture_urls: req.body.picture_urls,
		picture_ids: req.body.picture_ids,
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
	house
		.save()
		.then(result => console.log(result))
		.catch(error => console.log(error))
})
app.put("/House/UpdateHouse", (req, res) => {
	const house = req.body.house
	const id = req.body.id
	House.findByIdAndUpdate(id, house, {new: true})
		.then(house => console.log(house))
		.catch(err => console.log(err))
})
app.patch("/House/endRent/:id/:user_id", (req, res) => {
	const id = req.params.id
	const user_id = req.params.user_id
	House.findByIdAndUpdate(id, { current_teneant: "", past_teneant: user_id, inprogress: 2})
		.then(house => console.log(house))
		.catch(err => console.log(err))
})
app.post("/House/RemoveHouse", (req, res) => {
	const id = req.body.id
	House.findByIdAndDelete(id)
		.then(res => console.log(res))
		.catch(err => console.log(err))
	Reserve.find({info_id: id}).remove().catch(err => console.log(err))
})
app.post("/Roommate/RemoveRoommate", (req, res) => {
	const id = req.body.id
	Roommate.findByIdAndDelete(id)
		.then(res => console.log(res))
		.catch(err => console.log(err))
	Reserve.find({info_id: id}).remove().catch(err => console.log(err))
})
app.post("/User/RemoveUser", (req, res) => {
	const id = req.body.id
	User.findByIdAndDelete(id)
		.then(res => console.log(res))
		.catch(err => console.log(err))
	Review.find({user_id: id})
		.remove()
		.catch(err => console.log(err))
})
app.put("/House/ApproveHouse", (req, res) => {
	const id = req.body.id
	House.findByIdAndUpdate(id, {approved: true})
		.then(res => console.log(res))
		.catch(err => console.log(err))
})
app.put("/Roomate/ApproveRoomate", (req, res) => {
	const id = req.body.id
	Roommate.findByIdAndUpdate(id, {approved: true})
		.then(data => console.log(data))
		.catch(err => console.log(err))
})
app.post("/user/signup", (req, res) => {
	const password = req.body.password 
	const username = req.body.username
	const email = req.body.email
	bcrypt.genSalt(10, (err, salt) => {bcrypt.hash(password, salt, (err, hash) => {
		const user = new User({ 
			username: username,  
			password: hash, 
			email: email
			});
			  user
			.save()
			.then(user => {
			res.send("user " + user.username + " saved to database"); 
			}) 
			.catch(err => { 
			log(err)
			alert("email already exists"); 
			res.status(400).send(err); 
			}); 
	});});
	}); 
app.put("/user/updatePorfile", (req, res) => {
	const id = req.body.id
	const url = req.body.url
	User.findByIdAndUpdate(id, {picture_url: url}, {new: true})
		.then(user => res.send(user))
		.catch(err => console.log(err))
})
app.get("/login_credential/:user/:password", (req, res) => {
	const email = req.params.user
	const password = req.params.password
	const send_back = res
	User.find({email: email}).then(user => {
		if (user.length === 0){
			send_back.send("No user")
		}
		else{
			bcrypt.compare(password, user[0].password, (err, result) => {
				console.log(result)
				if (result){
					send_back.send(["logged in", user[0]])
				}
				else{
					send_back.send(["failed", user[0]])
				}
			});
		}
	})
})

app.get("/change_password/:id/:password/:newpassword", (req, res) => {
	const id = req.params.id
	console.log(id)
	const password = req.params.password
	const new_password = req.params.newpassword
	User.find({_id: id}).then(user => {
		bcrypt.compare(password, user[0].password, (err, result) => {
			if (result){
				bcrypt.genSalt(10, (err, salt) => {bcrypt.hash(new_password, salt, (err, hash) => {
					user[0].password = hash
						user[0]
					.save()
					.then(res1 => {
						console.log("there")
						res.send("Success")
					}) 
					.catch(err => { 
					res.status(400).send(err); 
					}); 
				});});
			}
			else{
				console.log("here")
				res.send("Incorrect password")
			}
		});
	})
})

app.post("/reserve", (req, res) => {
	const reserve = new Reserve({ 
		sender_id: req.body.sender_id, 
		receiver_id: req.body.receiver_id,
		reserve_type: req.body.reserve_type,
		approved: req.body.approved,
		info_id: req.body.info_id,
		start_date: req.body.start_date,
		end_date:req.body.end_date
		});
		reserve
	.save()
	.then(reserve => {
	res.send("reserve by " + reserve.user_id + " saved to database"); 
	}) 
	.catch(err => { 
	log(err)
	res.status(400).send(err); 
	});
}); 

app.post("/roommate/createRoommate", (req, res) => {
	const roommate = new Roommate({
		roommate_id: req.body.roommate_id,
		roommate_name: req.body.roommate_name,
		gender: req.body.gender,
		location: req.body.location,
		age: req.body.age,
		pets_friendly: req.body.pets_friendly,
		smoking: req.body.smoking,
		wakeup_time: req.body.wakeup_time,
		sleep_time: req.body.sleep_time,
		cooking_level: req.body.cooking_level,
		socialization_level: req.body.socialization_level,
		friendly_level: req.body.friendly_level,
		cleanliness: req.body.cleanliness,
		noisy_extent: req.body.noisy_extent,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		picture_urls: req.body.picture_urls,
		picture_ids: req.body.picture_ids,
		description: req.body.description
	})
	roommate
		.save()
		.then(roommate => console.log(roommate))
		.catch(err => console.log(err))
});

app.get('/roommateinfo/:id', (req, res) => {
	const id = req.params.id
	console.log(id)
	Roommate.findById(id).then((roommate) => {
		console.log(roommate)
		if(!roommate){
			res.status(404).send()
		} else {
			res.send(roommate)
		}
	}).catch((err) => {
		res.status(500).send()
	})
})

app.get('/house/:id', (req, res) => {
	// Add code here
	const id = req.params.id
	console.log(id)
	House.findById(id).then((house) => {
		console.log(house)
		if (!house){
			res.status(404).send()
		} else {
			res.send(house)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.get('/user/:id', (req, res)=>{
	const id = req.params.id
	User.findById(id).then((user)=>{
		console.log(user)
		if(!user){
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

/*** Webpage routes below **********************************/
// Serve the build
// app.use(express.static(__dirname + "/client/build"));

// // All routes other than above will go to index.html
// app.get("*", (req, res) => {
//     res.sendFile(__dirname + "/client/build/index.html");
// });