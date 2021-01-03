const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('./../utils/email');

exports.getOverview = catchAsync(async (req, res, next) => {
  res.status(200).render('index', {
    type: req.type
  });
});

exports.getAbout = catchAsync(async (req, res, next) => {
  res.status(200).render('about', {
    type: req.type
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  res.status(200).render('contact', {
    type: req.type
  });
});

exports.getSignUpForm = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    next();
  }
  res.status(200).render('signUp');
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {});
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.sendContactMail = catchAsync(async (req, res, next) => {
  let contact = {
    firstname: req.body.name,
    tel: req.body.mob,
    email2: req.body.email,
    message: req.body.content
  };
  await new Email(contact, '').sendFormMail();
  console.log(contact);
  res.status(200).json({
    status: 'success',
    data: {
      data: 'Email je poslan!'
    }
  });
});
