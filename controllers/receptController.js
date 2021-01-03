const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const axios = require('axios');
exports.getRecepts = catchAsync(async (req, res, next) => {
  // polja: query , cuisine, diet, intolerances, min max catbs, protein, fat, and calories
  // GET https://api.spoonacular.com/recipes/complexSearch
  //https://api.spoonacular.com/recipes/random
  let odg;
  try {
    odg = await axios.get(
      `${process.env.URL}/recipes/random?apiKey=${
        process.env.API_KEY
      }&number=12`
    );
  } catch (err) {
    return next(new AppError('Uppps. Try again later', 400));
  }
  res.status(200).render('recepts', {
    recepts: odg.data.recipes,
    type: req.type
  });
});

exports.searchSpecificRecepts = catchAsync(async (req, res, next) => {
  // polja: query , cuisine, diet, intolerances, min max catbs, protein, fat, and calories
  // GET https://api.spoonacular.com/recipes/complexSearch

  const {
    query,
    cuisine,
    diet,
    intolerances,
    type,
    sort,
    minCarb,
    maxCarb,
    minFat,
    maxFat,
    minProtein,
    maxProtein,
    minCalories,
    maxCalories
  } = req.body;

  const url = `${process.env.URL}/recipes/complexSearch?apiKey=${
    process.env.API_KEY
  }&query=${query}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerances}&type=${type}&sort=${sort}`;
  let odg = await axios.get(url);

  res.status(200).render('recepts', {
    recepts: odg.data.results,
    type: req.type
  });
});

exports.getReceptInfo = catchAsync(async (req, res, next) => {
  //GET https://api.spoonacular.com/recipes/{id}/information
  //https://api.spoonacular.com/recipes/1082038/nutritionWidget?apikey=8c8fb008e5954665aba3cdf8d6de7104
  // https://api.spoonacular.com/recipes/324694/analyzedInstructions - koraci
  //Dobijanje recepta
  const url = `${process.env.URL}/recipes/${req.params.id}/information?apiKey=${
    process.env.API_KEY
  }`;
  let odg = await axios.get(url);
  //Widgeti
  const url2 = `${process.env.URL}/recipes/${
    req.params.id
  }/ingredientWidget?apiKey=${process.env.API_KEY}`;
  let odg2 = await axios.get(url2);
  odg2 = odg2.data.split('<div id="spoonacular-ingredient-vis-list"')[0];
  odg2 = odg2.split('<div style="clear:both"></div>')[1];

  const url3 = `${process.env.URL}/recipes/${
    req.params.id
  }/nutritionWidget?apiKey=${process.env.API_KEY}`;
  let odg3 = await axios.get(url3);

  //Koraci
  const url4 = `${process.env.URL}/recipes/${
    req.params.id
  }/analyzedInstructions?apiKey=${process.env.API_KEY}`;
  let odg4 = await axios.get(url4);
  console.log(odg4.data[0].steps[0].ingredients[0]);

  res.status(200).render('SingleRecept', {
    recept: odg.data,
    widget: odg2,
    widget2: odg3.data.split(
      '<div style="margin-top:12px;width:12px;height:12px" class="spoonacular-nutrition-visualization-bar spoonacular-salmon"'
    )[0],
    koraci: odg4.data[0].steps,
    type: req.type
  });
});

exports.saveRecept = catchAsync(async (req, res, next) => {
  const recept = {
    id: req.body.id,
    comment: req.body.comment
  };
  req.user.recepti.push(recept);
  req.params.id = req.user.id;
  req.body = req.user;

  next();
});

exports.deleteRecept = catchAsync(async (req, res, next) => {
  const recept = {
    id: req.params.id
  };

  let receptFinalni = [];
  for (let i = 0; i < req.user.recepti.length; i++) {
    if (req.user.recepti[i].id != recept.id) {
      receptFinalni.push(req.user.recepti[i]);
    }
  }
  req.user.recepti = receptFinalni;
  req.params.id = req.user.id;
  req.body = req.user;
  next();
});

exports.showUsersRecepts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  let recepti = [];
  recepti = user.recepti.map(async el => {
    const url = `${process.env.URL}/recipes/${el.id}/information?apiKey=${
      process.env.API_KEY
    }`;
    let odg = axios.get(url);
    return odg;
  });

  recepti = await Promise.all(recepti);
  recepti = recepti.map(el => {
    return el.data;
  });

  res.status(200).render('savedRecepts', {
    status: user.status,
    recepts: recepti,
    type: req.type
  });
});

exports.getReceptChangeForm = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(req.params.id);
  let recept;
  user.recepti.map(el => {
    if (el.id == req.params.id) {
      recept = el;
    }
  });
  const url = `${process.env.URL}/recipes/${req.params.id}/information?apiKey=${
    process.env.API_KEY
  }`;
  let odg = await axios.get(url);

  const url2 = `${process.env.URL}/recipes/${
    req.params.id
  }/ingredientWidget?apiKey=${process.env.API_KEY}`;
  let odg2 = await axios.get(url2);
  odg2 = odg2.data.split('<div id="spoonacular-ingredient-vis-list"')[0];
  odg2 = odg2.split('<div style="clear:both"></div>')[1];

  const url3 = `${process.env.URL}/recipes/${
    req.params.id
  }/nutritionWidget?apiKey=${process.env.API_KEY}`;
  let odg3 = await axios.get(url3);

  //Koraci
  const url4 = `${process.env.URL}/recipes/${
    req.params.id
  }/analyzedInstructions?apiKey=${process.env.API_KEY}`;
  let odg4 = await axios.get(url4);
  console.log(odg4.data[0].steps[0].ingredients[0]);

  res.status(200).render('receptChange', {
    APIrecept: odg.data,
    recept: recept,
    widget: odg2,
    widget2: odg3.data.split(
      '<div style="margin-top:12px;width:12px;height:12px" class="spoonacular-nutrition-visualization-bar spoonacular-salmon"'
    )[0],
    koraci: odg4.data[0].steps,
    type: req.type
  });
});
exports.saveReceptChanges = catchAsync(async (req, res, next) => {
  console.log('sdsds');
  let user = await User.findById(req.user.id);
  user.recepti.forEach(el => {
    if (el.id == req.params.id) {
      el.comment = req.body.comment;
    }
    return el;
  });
  req.params.id = req.user.id;
  req.body = user;
  // user = await User.findByIdAndUpdate(req.user.id, user);
  next();
});
/////////////////////////////////////////////////
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    type: req.type,
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateRecept = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
