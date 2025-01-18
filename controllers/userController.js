import asyncHandler from 'express-async-handler'
import Model from '../models/useModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Token from '../models/tokenModel.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.js'

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"1d"});
}
// try {
    //   const { email } = req.body;
  
    //   if (!email) {
    //     res.status(400);
    //     throw new Error('Please add an email');
    //   }
  
    //   res.status(200).json({ message: 'User registered successfully!' });
    // } catch (error) {
    //   next(error); // Pass the error to the errorHandler middleware
    // }

//Register User  
export const registerUser = asyncHandler( async (req, res, next) => {
  const {name, email, password} = req.body
  //validation
  if(!name || !email || !password){
    res.status(400)
    throw new Error("Please fill in all required fields")
  }
  if(password.length < 6){
    res.status(400)
    throw new Error("Password must be up to 6 characters")
  }
  // Check if user email already exists
  const userExists = await Model.findOne({email})
  if(userExists){
    res.status(400)
    throw new Error("Email has already been registered")
  }
  //Create new user
  const user = await Model.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);
  //Send HTTP-only cookie
  res.cookie("token", token,{
    path: '/',
    httpOnly:true,
    expires: new Date(Date.now() + 1000 * 86400),  //one day
    sameSite: "none",
    secure: true
  })
   if (user) {
    const { _id, name, email, phone, photo, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      photo,
      bio,
      token,
    });
  }
    else{
        res.status(400)
        throw new Error("Invalid user data")
    }
   
  });
 
  //Login User
  export const logIn = asyncHandler( async (req,res) => {
    const {email, password} = req.body

    //Validate Request
    if(!email || !password){
        res.status(400)
        throw new Error("Please add email and password")
    }
    // Check if user exists
    const user = await Model.findOne({email})
    if(!user){
        res.status(400)
        throw new Error("User not found, Please Signup")
    }
    //User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    const token = generateToken(user._id);
 //Send HTTP-only cookie
    res.cookie("token", token,{
      path: '/',
      httpOnly:true,
      expires: new Date(Date.now() + 1000 * 86400),  //one day
      sameSite: "none",
      secure: true
    })
    if(user && passwordIsCorrect){
        const { _id, name, email, phone, photo, bio } = user;
        res.status(200).json({
          _id,
          name,
          email,
          phone,
          photo,
          bio,
          token,
        });
      }
        else{
            res.status(400)
            throw new Error("Invalid Email or Password")
    }
  })

  //Logout User 
 export const logOut = asyncHandler( async(req, res) =>{
    res.cookie("token","",{
        path: '/',
        httpOnly:true,
        expires: new Date(Date.now(0) ),  //Current Second
        sameSite: "none",
        secure: true
      });
      return res.status(200).json({message:"Successfully Logged Out"})
  });

 export const getUser = asyncHandler( async (req, res) =>{
    const user = await Model.findById(req.user._id)
    if (user) {
        const { _id, name, email, phone, photo, bio } = user;
        res.status(201).json({
          _id,
          name,
          email,
          phone,
          photo,
          bio,
        });
      }
        else{
            res.status(400)
            throw new Error("User not Found")
        }
       
  })
  
  //Logged in Status
  export const loginStatus = asyncHandler( async (req, res) =>{
    const token = req.cookies.token
    if(!token){
        return res.json(false)
    }
    // Verify Token
     const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        return res.json(true)
    }
     return res.json(false)
       
  })

  //Update User
  export const updateUser = asyncHandler( async (req, res) =>{
    const user = await Model.findById(req.user._id)
       
    if(user){
      const {name, email, phone, photo, bio} = user;
      user.email = email;
      user.name = req.body.name || name; // USER DOES NOT SEND ANY NAME, PREVIOUSLY EXIST NAME IS SAVED
      user.phone = req.body.phone || phone;
      user.photo = req.body.photo || photo;
      user.bio = req.body.bio || bio;

      const updateUser = await user.save();
      res.status(200).json({
        _id : updateUser._id,
        name : updateUser.name,
        phone : updateUser.phone,
        photo : updateUser.photo,
        bio : updateUser.bio

      })
    }else{
      res.status(404)
        throw new Error ("User not found");
    }
    
  })

  export const changePassword = asyncHandler( async(req, res) =>{
    const user = await Model.findById(req.user._id);
    const {oldPassword, password} = req.body;

    if(!user){
      res.status(400)
      throw new Error("User not found, Please Signup")
  }
    //Validate
    if(!oldPassword || !password){
      res.status(400);
      throw new Error ("Please add old and new password");
    }
    //Check if old password matches password in DB 
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    //Save new password
    if(user && passwordIsCorrect){
      user.password = password;
      await user.save();
      res.status(200).send("Password change successful");
    }else{
      res.status(400);
      throw new Error("Old password is incorrect");
    }

  })

  export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await Model.findOne({email});
  
    if (!user) {
      res.status(404); // Set the response status code
      throw new Error("User does not exist"); // Throw an error to be handled by middleware
    }
    // Delete token if it exists in DB 
    let token = await Token.findOne({userId: user._id})
    if(token){
      await token.deleteOne();
    }
  
    // Create Reset Token
   let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
   console.log(resetToken)
   //Hash token before saving to DB
   const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
   //Save Token to DB
   await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 *(60*1000) //Thiry Minutes
   }).save();

   //Construct Reset URI
   const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
   //Reset Email 
   const message = `<h2> Hello ${user.name}<h2/>
                    <p> Please use the url below to reset your password</p>
                    <p> This reset link is valid for only 30 minutes.</p>
                    <a href = ${resetUrl} clicktracking = off> ${resetUrl} </a>
                    <p> Regards..... </p>`
    const subject ="Password Rest Request"
    const send_to = user.email
    const sent_from = process.env.EMAIL_USER

    try {
      await sendEmail(subject, message, send_to, sent_from)
      res.status(200).json({
        success: true,
        message: "Reset Email Sent" 
      })
    } catch (error) {
      res.status(500)
      throw new Error("Email not sent, Please try again")
    }
  });

  export const resetPassword = asyncHandler(async (req, res) => {
  const {password} = req.body
  const {resetToken} = req.params
  //Hash token before saving to DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  //find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()}
  })
  if(!userToken){
    res.status(404 )
    throw new Error("Invalid or Expired Token")
  }
  //Find user
   const user = await Model.findOne({_id:userToken.userId})
   user.password = password
   await user.save()
   res.status(200).json({
    message:"Password Reset Successful, Please Login"
   })
  })