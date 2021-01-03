const axios = require('axios');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllMeals = catchAsync(async (req, res, next) => {
  // GET https://api.spoonacular.com/mealplanner/public-templates
  let odg;

  try {
    odg = await axios.get(
      `${process.env.URL}/mealplanner/public-templates?apiKey=${
        process.env.API_KEY
      }&number=24`
    );
  } catch (err) {
    return next(new AppError('Uppps. Try again later', 400));
  }
  res.status(200).render('templates', {
    templates: odg.data.templates.sort(() => Math.random() - 0.5).slice(1, 40),
    type: req.type
  });
});

exports.getMealInfo = catchAsync(async (req, res, next) => {
  //GET https://api.spoonacular.com/mealplanner/{username}/templates/{id}
  let odg = await axios.get(
    `${process.env.URL}/mealplanner/${req.user.APIusername}/templates/${
      req.params.id
    }?hash=${req.user.APIpassword}&apiKey=${process.env.API_KEY}`
  );

  res.status(200).render('templateInfo', {
    template: odg.data,
    type: req.type
  });
});

exports.addMealTemplate = catchAsync(async (req, res, next) => {
  //post https://api.spoonacular.com/mealplanner/api-37771-1054/items?hash=007070ee3c334ff0c8d459e98e713ea7126c5d97&apiKey=94fbd745cd4c4137acf9390462d2b208
  //https://api.spoonacular.com/mealplanner/api-37771-1054/week/2020-08-28?hash=007070ee3c334ff0c8d459e98e713ea7126c5d97&apiKey=94fbd745cd4c4137acf9390462d2b208

  let odg = await axios.post(
    `${process.env.URL}/mealplanner/${req.user.APIusername}/items/?hash=${
      req.user.APIpassword
    }&apiKey=${process.env.API_KEY}`,
    {
      mealPlanTemplateId: req.params.id,
      startDate: Math.round(new Date(req.body.date).getTime() / 1000)
    }
  );

  if (odg.data.status != 'success') {
    return next(new AppError('Upssss. Try again later', 400));
  }
  req.user.datumiObroka.push(req.body.date);
  await User.findByIdAndUpdate(req.user.id, req.user, {
    new: true,
    runValidators: true
  });
  res.status(222).json({
    status: 'success',
    type: req.type,
    data: {
      data: null
    }
  });
});

exports.getMyMeal = catchAsync(async (req, res, next) => {
  //https://api.spoonacular.com/mealplanner/{username}/day/{date}

  let date = new Date().toJSON().split('T')[0];
  let odg;
  try {
    odg = await axios.get(
      `${process.env.URL}/mealplanner/${
        req.user.APIusername
      }/day/${date}?hash=${req.user.APIpassword}&apiKey=${process.env.API_KEY}`
    );
  } catch (err) {
    return next(new AppError('Niste dodali plan ishrane za ovaj dan.', 401));
  }
  res.status(200).render('myMeal', {
    template: odg.data,
    type: req.type
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  //https://api.spoonacular.com/mealplanner/api-37771-1054/items/44?hash=44&apiKey=44

  let weekTIme = 1000 * 60 * 60 * 24;
  let d = req.user.datumiObroka;
  req.user.datumiObroka = [];
  const user = await User.findByIdAndUpdate(req.user.id, req.user, {
    new: true,
    runValidators: true
  });

  for (let i = 0; i < d.length; i++) {
    console.log('datum');
    let t = new Date(d[i]).getTime();
    for (let j = 0; j < 600; j++) {
      console.log('sedmica');
      let date = new Date(t).toJSON().split('T')[0];
      //poziv na api sa date
      let odg;
      try {
        odg = await axios.get(
          `${process.env.URL}/mealplanner/${
            req.user.APIusername
          }/day/${date}?hash=${req.user.APIpassword}&apiKey=${
            process.env.API_KEY
          }`
        );
      } catch (err) {
        break;
      }
      console.log(odg.data);
      for (let k = 0; k < odg.data.items.length; k++) {
        console.log('recept');
        await axios.delete(
          `${process.env.URL}/mealplanner/${req.user.APIusername}/items/${
            odg.data.items[k].id
          }?hash=${req.user.APIpassword}&apiKey=${process.env.API_KEY}`
        );
      }
      t = t + weekTIme;
    }
  }

  res.status(200).redirect('/meal/myMeal');
});
